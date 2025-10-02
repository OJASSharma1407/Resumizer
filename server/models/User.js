const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    googleId:{
        type:String,
        default:null
    }
}, { timestamps: true })

module.exports = mongoose.model("User",UserSchema);
