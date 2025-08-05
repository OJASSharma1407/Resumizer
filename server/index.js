const express = require('express');
const app = express();
const port = 5000;
//middleWare
app.use(express.json());

//Routes




//app listning on port 5000
app.listen(port,()=>{
    console.log(`server connected on port ${port}`);
})
