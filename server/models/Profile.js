const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    age:{
        type:Number,
    },
    gender:{
        type:String
    },
})