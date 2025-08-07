const mongoose = require('mongoose');

const ResumeOperationSchema = new mongoose.Schema({
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
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
    }
});

module.exports = mongoose.model("ResumeOperation", ResumeOperationSchema);
