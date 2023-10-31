const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
var cors = require('cors');

const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
app.use(cors(corsOpts));


const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const verificationTokenRoutes = require('./routes/verificationTokenRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use(express.json("application/json"))
app.use(userRoutes)
app.use(accountRoutes)
app.use(sessionRoutes)
app.use(verificationTokenRoutes)
app.use(movieRoutes)

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post("/test", function(req, res){
    const ver = null;
    try{
        ver = jwt.verify(req.body.token, process.env.MY_SECRET)
        console.log(ver)
        res.sendStatus(200)
    }
    catch{
        console.log("não")
        res.sendStatus(401)
    }
    
    //res.send(ver)
})

app.listen(3001, () => {
    console.log('App listening on port 3001.');
});