const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedIn: { type: String },
    github: { type: String },
  },

  careerObjective: {
    type: String
  },

  skills: [
    { type: String } // e.g., ["HTML", "CSS", "JavaScript"]
  ],

  techStack: [
    { type: String } // e.g., ["MERN", "LAMP"]
  ],

  workExperience: [{
    company: { type: String }, // Optional
    role: { type: String },
    duration: { type: String },
    description: { type: String }
  }],

  projects: [{
    title: { type: String },
    description: { type: String },
    link: { type: String }
  }],

  education: [{
    institution: { type: String },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startYear: { type: String },
    endYear: { type: String },
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GetResume', ResumeSchema);
