require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');



app.use(express.json());

const posts = [
    { 
        username : "Mike",
        title : "Software Developer"
    },
{
        username : "Ryan",
        title : "Fullstackk Developer"
    }
];

app.get("/",(req,res) => {
    res.json('Welcome to my page');
    res.end();

})

app.get("/posts",authenToken,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post("/login",(req,res)=> {
    //Authenticate user

    const username =req.body.username;
    const user = { name: username};
   const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRETE);
   res.json({accessToken : accessToken})
});

// Create a middleware to Authenticate our token
 function authenToken(req,res,next){
        // Get the Authentication Token 
        const authHeader = req.headres['authorization'];

        // Returning TOKEN Portion
        const token = authHeader && authHeader.split(' ')[1];
        if(token === null) return req.sendStatus(401);

        // Verifying our token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE,(err,user)=>{

            // If the token is no longer valid
            if(err) return  req.sendStatus(403);
            req.user = user;
            next()
        });

 }

app.listen(3000);