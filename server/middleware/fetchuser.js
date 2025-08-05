require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.Jwt_secret

const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: 'Authenticate using a valid token'});
    }
    try{
        const data = jwt.verify(token,jwt_secret);
        req.user = data;
        next();
    }catch(err){
        res.status(400).json({error:err.message});  
    }
}

module.exports = fetchuser;