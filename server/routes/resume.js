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

// DELETE resume by ID
router.delete('/delete-resume/:id', fetchuser, async (req, res) => {
  try {
    const resume = await GetResume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, error: "Resume not found or unauthorized" });
    }
    await resume.deleteOne();
    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Delete Resume Error:", err);
    res.status(500).json({ success: false, error: "Server error while deleting resume" });
  }
});


//-------------Edit Resume--------------//
router.put('/edit-resume/:id', fetchuser, async (req, res) => {
  const resumeId = req.params.id;
  const {
    personalInfo,
    careerObjective,
    skills,
    techStack,
    workExperience,
    projects,
    education
  } = req.body;

  try {
    let resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume does not exist" });
    }

    // Ensure the resume belongs to the logged-in user
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const updatedFields = {
      personalInfo,
      careerObjective,
      skills,
      techStack,
      workExperience,
      projects,
      education
    };

    // Update only fields provided in req.body
    resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.json({ success: true, resume });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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
You are a professional resume writer.

Your task is to generate ONLY a clean, properly formatted **resume** using the data provided below.

⚠️ STRICT INSTRUCTIONS — DO NOT IGNORE:
- The output MUST contain only the resume — absolutely NO commentary, notes, explanations, or extra text at the beginning or end.
- DO NOT write anything like “Here is the resume”, “You can edit it”, or “Let me know if you want changes”.
- DO NOT add quotes or remarks around any section.
- MAKE SURE it has good format 
- Use professional tone, spacing, bullet points, and clean layout.
- Ensure readability with proper line breaks.
- Stick ONLY to the candidate's data — NO assumptions or creative additions.

==========================
CANDIDATE DETAILS:
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
  `• ${exp.role} (${exp.duration}) – ${exp.company || 'N/A'}
  ${exp.description}`
)).join("\n")}

Projects:
${projects.map((proj) => (
  `• ${proj.title}: ${proj.description} (Link: ${proj.link})`
)).join("\n")}

Education:
${education.map((edu) => (
  `• ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startYear} – ${edu.endYear})`
)).join("\n")}
==========================

Now return ONLY the resume I REPEAT ONLY RESUME ON EXTRA THINGS IN THE RESPONSE CUS I HAVE TO CONVERT IT INTO A PDF — no intro, no outro, no suggestions. Just the resume.
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
