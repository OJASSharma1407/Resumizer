require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Resume = require('../models/GetResume');
const ResumeOperation = require('../models/ResumeOperation');
const CoverLetter = require('../models/CoverLetter');
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.api_key,
});

//-------Feedback Route-------//
router.post('/feedback/:id', fetchuser, async (req, res) => {
  const resumeId = req.params.id;
  try {
    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) {
      return res.status(400).json({ error: "Resume not found or unauthorized" });
    }

    const {
      personalInfo,
      careerObjective,
      skills,
      techStack,
      workExperience,
      projects,
      education
    } = resume;

    const prompt = `
I want you to act as a professional resume reviewer.
- DO NOT recreate the resume. Just provide review/feedback.
- Tell what's good, what can be improved, and what's unnecessary.
- Format with proper spacing, line breaks, bullet points.
- Keep the tone professional and concise.

Candidate Data:
------------------------------
Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
GitHub: ${personalInfo.github}
LinkedIn: ${personalInfo.linkedIn}

Career Objective: ${careerObjective}

Skills: ${skills.join(', ')}
Tech Stack: ${techStack.join(', ')}

Work Experience:
${workExperience.map((exp) => (
  `• Role: ${exp.role}, Duration: ${exp.duration}
  Description: ${exp.description}`
)).join("\n")}

Projects:
${projects.map((proj) => (
  `• ${proj.title}: ${proj.description} (Link: ${proj.link})`
)).join("\n")}

Education:
${education.map((edu) => (
  `• ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startYear} - ${edu.endYear})`
)).join("\n")}
------------------------------`;

    const response = await cohere.generate({
      model: 'command',
      prompt,
      max_tokens: 800,
      temperature: 0.7,
    });

    const feedback = response.generations[0].text;

    let resumeOp = await ResumeOperation.findOne({ resume: resumeId, user: req.user.id });

    if (resumeOp) {
      resumeOp.resumeFeedback = feedback;
    } else {
      resumeOp = new ResumeOperation({
        resume: resumeId,
        user: req.user.id,
        resumeFeedback: feedback,
      });
    }

    await resumeOp.save();
    res.status(200).json({ success: true, response: feedback });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//-------Cover Letter Route-------//
router.post('/get-cover-letter', fetchuser, async (req, res) => {
  const { description } = req.body;

  // Handle missing data
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: "Please provide a valid 'description' field." });
  }

  try {
    const prompt = `
You are an expert professional cover letter writer. Based on the following candidate information, write a clean, properly formatted cover letter.

STRICT RULES:
- ONLY output a clean cover letter.
- DO NOT include any commentary, explanation, or extra text before or after the letter.
- Use proper formatting, spacing, line breaks, and bullet points.
- Maintain a professional and concise tone.
- DO NOT include phrases like "Here is the candidate’s data", "Let me know if you want changes", etc.
- DO NOT add instructions, notes, or closing sentences outside the cover letter.

------------------------------
${description}
`;

    const response = await cohere.generate({
      model: 'command',
      prompt,
      max_tokens: 800,
      temperature: 0.7,
    });

    const coverLetter = response.generations?.[0]?.text?.trim();

    if (!coverLetter) {
      return res.status(500).json({ error: "Failed to generate cover letter from Cohere." });
    }

    const newCoverLetter = new CoverLetter({
      user: req.user.id,
      coverletter: coverLetter,
    });

    await newCoverLetter.save();
    res.status(200).json({ success: true, response: coverLetter });

  } catch (err) {
    console.error("Cohere error:", err);
    res.status(500).json({ error: "Something went wrong while generating cover letter." });
  }
});

module.exports = router;
