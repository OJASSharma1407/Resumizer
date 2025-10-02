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
        res.json({ 
            token, 
            user: { 
                id: newUser._id, 
                fullname: newUser.fullname, 
                email: newUser.email 
            } 
        });

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
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                fullname: user.fullname, 
                email: user.email 
            } 
        });

    }catch(err){
        res.status(400).json({error:err.message});    
    }
});

//--------Google Login-------//
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: "No token provided" });
        }         
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub } = payload;
        const pass = await bcrypt.hash(sub, 10);
        
        let user = await User.findOne({ email });

        if (!user) {
            const newUser = new User({
                fullname: name,
                email,
                password: pass,
                googleId: sub
            });
            user = await newUser.save();
        }

        const data = { id: user.id };
        const token = jwt.sign(data, secret);
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                fullname: user.fullname, 
                email: user.email 
            } 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------Verify Token-------//
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});



module.exports = router;