const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {registerValidations, loginValidations} = require("../validation");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenList = {};
// Register
router.post('/register',async (req,res) => {
    const reqBody    = req.body;
    // validate the user
    const {error} = registerValidations(reqBody);
    if(error) return res.status(400).json({status: 'error',"msg":error.details[0].message});

    // check email already exists
    const emailExist = await User.findOne({email:reqBody.email});

    if(emailExist) return res.status(400).json({status: 'error',"msg": "email already exists."});
    
    // hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password,salt);

    const newUser = new User({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword
    });
    
    try {
        const savedUser = await newUser.save();
        res.json({status: 'success',msg:"Successfully Added!", data: savedUser._id});
    } catch(err) {
        res.json({status: 'success',msg:"Error!", dbErr: err});
    }
});

//login
router.post('/login',async (req,res) => {
    const reqBody    = req.body;
    // validate the user
    const {error} = loginValidations(reqBody);
    if(error) return res.status(400).json({status: 'error',"msg":error.details[0].message});

    // check user already exists
    const user = await User.findOne({email:reqBody.email});

    if(!user) return res.status(400).json({status: 'error',"msg": "User not found."});

    //Password is correct
    const validPass = await bcrypt.compare(reqBody.password,user.password);

    if(!validPass) return res.status(400).json({status: 'error',"msg": "Invalid Password."});

    //create the access token with the shorter lifespan
    const token = jwt.sign({ _id:user._id }, process.env.TOKEN_SECRET,{
        //algorithm: "HS256",
        expiresIn: process.env.TOKEN_LIFE
    });

    //create the refresh token with the longer lifespan
    let refreshToken = jwt.sign({ _id:user._id }, process.env.REFRESH_TOKEN_SECRET, {
        //algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_LIFE
    })
    let response = {
        status: 'success',
        msg: "Login Successfully!",
        token: token,
        refresh_token:refreshToken
    }
    tokenList[refreshToken] = response;
    res.header('auth-token', token).json(response);

});
//refresh token
router.post('/refresh-token', (req,res) => {
    // refresh the damn token
    const postData = req.body

    // console.log("postData");
    // console.log(postData);
    // console.log("tokenList");
    // console.log(tokenList);
    // if refresh token exists
    if((postData.refresh_token) && (postData.refresh_token in tokenList)) {

        try {
            decoded = jwt.verify(postData.refresh_token, process.env.REFRESH_TOKEN_SECRET);
        } catch (e) {
            res.status(401).json({status: 'error',"msg": "unauthorized"});
        }
        const token = jwt.sign({ _id:decoded._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE});
       
        const response = {
            status: 'success',
            msg: "",
            token: token,
        }
        // update the token in the list
        tokenList[postData.refresh_token] = response; 
        res.status(200).json(response);  
    } else {
        res.status(404).json({status: 'error',"msg": "Invalid request"});
    }
})

//me
router.get('/me',async (req,res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;

        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            
        } catch (e) {
            console.log("err");
            console.log(e);
            res.status(401).json({status: 'error',"msg": "unauthorized"});
        }
        
        const user = await User.findOne({_id:decoded._id});
        res.json({status: 'success',msg:"", data: user});
    }else {
        res.status(401).json({status: 'error',"msg": "Access Denied"});
    }

    
});

module.exports = router;