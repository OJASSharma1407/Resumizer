require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Resume = require('../models/GetResume');
const PDFDocument = require('pdfkit');
const ResumeOperation = require('../models/ResumeOperation');
const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({
  token: process.env.api_key, // put your Cohere API key in your .env file
});

//--------Add Resume info--------//
router.post('/add-resume-info', fetchuser, async (req, res) => {
  try {
    const {
      personalInfo,
      careerObjective,
      skills,
      techStack,
      workExperience,
      projects,
      education
    } = req.body;

    const newResume = new Resume({
      user: req.user.id, // coming from fetchuser middleware
      personalInfo,
      careerObjective,
      skills,
      techStack,
      workExperience,
      projects,
      education
    });

    const savedResume = await newResume.save();
    res.status(200).json({ success: true, resume: savedResume });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//--------get Resume info--------//
router.get('/get-resumes', fetchuser, async (req, res) => {
    const userId = req.user.id;
  try {
    
    const userResumes = await Resume.find({user:userId});

    res.status(200).json({ success: true,
        count:userResumes.length ,
        userResumes 
    });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

//--------get-perticular-resume------//
router.get('/get-resume/:id', fetchuser, async (req, res) => {
    
  try {
    const resumeId = req.params.id;                // plain string id
    const userId   = req.user.id;                  // set by fetchuser    
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if(!resume){
       return  res.status(400).json({ success: false,resume:"resume does not exist"});
    }
    res.status(200).json({ success: true,resume});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

//--------Build Ai generated Resume------//
router.post('/build-resume/:id',fetchuser,async(req,res)=>{
 
  try{
     const resumeId = req.params.id;
      const userId = req.user.id;
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if(!resume){
      return res.status(400).json({success:false,err:"resume not found"});
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
      I want you to act as a professional resume writer.
      Write ONLY a clean, properly formatted resume based on the following data.
      - DO NOT include commentary or explanations.
      - Use clear section titles like "SUMMARY", "EXPERIENCE", "EDUCATION", etc.
      - Format with proper spacing, line breaks, and bullet points.
      - Keep the tone professional and concise.
      - Do NOT include any closing sentences Not in the start and Not in the end like "Let me know if you want changes."
            Here is the candidate’s data: or this resume is written in a clean and professional format. 
            You can customize it based on additional information or requirements if needed, and feel free to ask for adjustments or variations 
      - The End result should only be a resume do not add any note or anything else in start or in the end JUST RESUME ONLY
      - Ensure that you follows all these instrunctions
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
      ${workExperience.map((exp, i) => (
        `• Role: ${exp.role}, Duration: ${exp.duration}
        Description: ${exp.description}`
      )).join("\n")}

      Projects:
      ${projects.map((proj, i) => (
        `• ${proj.title}: ${proj.description} (Link: ${proj.link})`
      )).join("\n")}

      Education:
      ${education.map((edu) => (
        `• ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startYear} - ${edu.endYear})`
      )).join("\n")}

      ------------------------------

      Now, write a clean, professional resume based on this info. Format each section with bullet points where needed, use professional tone, and enhance the experience descriptions.
      `;

      const response = await cohere.generate({
        model: 'command',
        prompt: prompt,
        max_tokens: 800,
        temperature: 0.7,
      });
       const aiResponse = response.generations[0].text;
       const saveaiResponse = new ResumeOperation({
        resume:resumeId,
        user:req.user.id,
        refinedResume:aiResponse
       })
       await saveaiResponse.save();
      res.status(200).json({success:true,response:aiResponse});
        }catch(err){
          res.status(400).json({error:err.message});
        }
      })

//------Download Resume--------//
router.get('/download-resume/:id', fetchuser, async (req, res) => {
  try {
    const resumeOp = await ResumeOperation.findById(req.params.id );

    if (!resumeOp) {
      return res.status(404).json({ success: false, error: "Refined resume not found" });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=refined-resume.pdf');

    doc.pipe(res);
    doc.fontSize(12).text(resumeOp.refinedResume || 'No content found');
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while downloading refined resume" });
  }
});

module.exports = router;
