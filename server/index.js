require('dotenv').config();
const connectionString = process.env.mongo_URI;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path'); 
const cors =  require("cors");
app.use(cors());
//middleWare
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use('/user-auth',require('./routes/userAuth'));
app.use('/resume',require('./routes/resume'));
app.use('/aboutResume',require('./routes/resumeOperation'));
app.use('/coverletter',require('./routes/coverletter'));


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