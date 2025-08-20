const mongoose = require('mongoose');

const ResumeOperationSchema = new mongoose.Schema({
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GetResume",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refinedResume: {
        type: String
    },
    resumeFeedback: {
        type: String
    },
    cretated_at:{
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model("ResumeOperation", ResumeOperationSchema);
