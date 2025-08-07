const mongoose = require('mongoose');

const CoverLetterSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    coverletter:{
        type:String,
    }
})

module.exports = mongoose.model("CoverLetter",CoverLetterSchema);