require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const Resume = require('../models/Resume');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.open_ai});
const PDFDocument = require('pdfkit');


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
    const resume = await Resume.findById({ _id: resumeId, user: userId });
    if(!resume){
        res.status(400).json({ success: false,resume:"resume does not exist"});
    }
    res.status(200).json({ success: true,resume});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

//--------Build Ai generated Resume------//
router.post('/build-resume/:id',fetchuser,async(req,res)=>{
  const resumeId = req.params.id;
  const user = req.user.id;
  try{
    const resume = await Resume.findById({_id:resumeId,user:user});
    if(!resume){
      res.status(400).json({success:false,erro:"resume not found"});
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

      Here is the candidate’s data:
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

      const completion = await openai.createChatCompletion.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
       const aiResponse = completion.choices[0].message.content;
      res.status(200).json({success:true,response:aiResponse});
        }catch(err){
          res.status(400).json({error:err.message});
        }
      })

//------Download Resume--------//
router.get('/download-resume/:id', fetchuser, async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;

    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      return res.status(404).json({ success: false, error: "Resume not found" });
    }

    const doc = new PDFDocument();
    
    // Set response headers to download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${resume.personalInfo.name}-resume.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Build PDF content
    doc.fontSize(18).text(resume.personalInfo.name, { underline: true });
    doc.fontSize(12).text(`Email: ${resume.personalInfo.email}`);
    doc.text(`Phone: ${resume.personalInfo.phone}`);
    doc.text(`GitHub: ${resume.personalInfo.github}`);
    doc.text(`LinkedIn: ${resume.personalInfo.linkedIn}`);
    doc.moveDown();

    doc.fontSize(14).text('Career Objective:', { underline: true });
    doc.fontSize(12).text(resume.careerObjective || 'N/A');
    doc.moveDown();

    doc.fontSize(14).text('Skills:', { underline: true });
    doc.fontSize(12).text(resume.skills.join(', ') || 'N/A');
    doc.moveDown();

    doc.fontSize(14).text('Tech Stack:', { underline: true });
    doc.fontSize(12).text(resume.techStack.join(', ') || 'N/A');
    doc.moveDown();

    doc.fontSize(14).text('Work Experience:', { underline: true });
    resume.workExperience.forEach(exp => {
      doc.fontSize(12).text(`- ${exp.role} at ${exp.company} (${exp.duration})`);
      doc.text(`  ${exp.description}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Projects:', { underline: true });
    resume.projects.forEach(proj => {
      doc.fontSize(12).text(`- ${proj.title}: ${proj.description}`);
      if (proj.link) doc.text(`  Link: ${proj.link}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Education:', { underline: true });
    resume.education.forEach(edu => {
      doc.fontSize(12).text(`- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startYear} - ${edu.endYear})`);
    });

    doc.end(); // Finalize PDF

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error while generating PDF' });
  }
});
module.exports = router;
