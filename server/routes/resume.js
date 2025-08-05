require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const secret = process.env.Jwt_secret;
const Resume = require('../models/Resume');

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
module.exports = router;
