require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Resume = require('../models/GetResume');
const ResumeOperation = require('../models/ResumeOperation');



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

//--------Delete Ai Resume----------//
router.delete('/delete-ai-resume/:id',fetchuser,async(req,res)=>{
  const resume = req.params.id;
  try{
    const findResume = await ResumeOperation.findById(resume);
    if(!findResume){
      return res.status(404).send("Resume not found");
    }

    await ResumeOperation.findByIdAndDelete(resume);

    res.status(200).json(findResume);

  }catch(err){
    res.status(400).json({error:err.message});
  }
})



module.exports = router;
