const mongoose = require('mongoose');

const CoverLetterSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type:String, required: true },
        linkedIn: { type: String },
        github: { type: String },
  },
    description:{
        type:String,
        required:true
    },
    coverletter:{
        type:String,
    }
})

module.exports = mongoose.model("CoverLetter",CoverLetterSchema);