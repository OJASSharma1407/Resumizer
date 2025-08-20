require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Resume = require('../models/GetResume');
const ResumeOperation = require('../models/ResumeOperation');
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

// Get all AI-generated resumes for the logged-in user
router.get('/get-ai-resume/:id', fetchuser, async (req, res) => {
  const userId = req.user.id;
  const resumeId = req.params.id;
  try{
    if(!resumeId){
      return res.status(404).send("Resume not found");
    }

    const resume  = await ResumeOperation.find({ resume: resumeId, user: userId })

      .populate("resume")
      .populate("user","name email");

    if(!resume || resume.length === 0 ){
      return res.status(404).send("No resume found");
    }
    res.status(200).json(resume);
 }catch(err){
  res.status(400).json({error:err.message});
 }
});





module.exports = router;
