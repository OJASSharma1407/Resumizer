require('dotenv').config();
const connectionString = process.env.mongo_URI;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path'); 
const cors = require("cors");

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://resumizer-fpdb.onrender.com',
      'https://resumizer-eight.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*'],
  exposedHeaders: ['*']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});
//middleWare
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use('/user-auth',require('./routes/userAuth'));
app.use('/resume',require('./routes/resume'));
app.use('/aboutResume',require('./routes/resumeOperation'));
app.use('/coverletter',require('./routes/coverletter'));
app.use('/ai',require('./routes/aiEnhancement'));


//app listning on port 5000
mongoose.connect(connectionString)
  .then(() => {
    console.log("✅ Connected to DB");

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });