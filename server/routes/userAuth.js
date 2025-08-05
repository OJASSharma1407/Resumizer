require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.Jwt_secret;
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const clientId = process.env.client_Id;
//-------Sign In--------//
router.post('/signIn',[
    body('fullname',"Enter your full name ").exists(),
    body('email', "Enter your email ").isEmail(),
    body("password","Enter a Strong password").isLength({min:8})
],async(req,res)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try{
        const {fullname,email,password} = req.body;

        const chkEmail = await User.findOne({email});
        if(chkEmail){
            res.status(400).json({error:"Email Already registered!!!"});
        }
        const secPass = await bcrypt.hash(password,10);

        const newUser = new User({
            fullname,email,
            password:secPass
        })
        await newUser.save();
        const data = {
            id: newUser.id
        }
        const token = jwt.sign(data,secret);
        res.send(token);

    }catch(err){
        res.status(400).json({error:err.message});    
    }
});



//-------Log In--------//
router.post('/logIn',[
    body('email', "Enter your email ").isEmail(),
    body("password","Enter a Strong password").isLength({min:8})
],async(req,res)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try{
        const {email,password} = req.body;

        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({error:"Email not registered!!!"});
        }

        const verifyPass = await bcrypt.compare(password,user.password);
        if(!verifyPass){
            res.status(400).json({error:"Invalid Credentials!!!"});
        }


        const data = {
            id: user.id
        }
        const token = jwt.sign(data,secret);
        res.send(token);

    }catch(err){
        res.status(400).json({error:err.message});    
    }
});

//--------Google Login-------//
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;// This is the token from frontend
        if (!credential) {
            return res.status(400).json({ error: "No token provided" });
        }         
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;  // sub = Google's user ID
        const pass = await bcrypt.hash(clientId,10);
        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            const newUser = new User({
                fullname: name,
                email,
                password:pass   // Save Google user ID as password placeholder
            });
            user = await newUser.save();
        }

        const data = { id: user.id };
        const token = jwt.sign(data, secret);
        res.send({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;