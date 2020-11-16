const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {registerValidations, loginValidations} = require("../validation");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register',async (req,res) => {
    const reqBody    = req.body;
    console.log('reqBody');
    console.log(reqBody);
    // validate the user
    const {error} = registerValidations(reqBody);
    if(error) return res.status(400).json({"msg":error.details[0].message});

    // check email already exists
    const emailExist = await User.findOne({email:reqBody.email});

    if(emailExist) return res.status(400).json({"msg": "email already exists."});
    
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
        res.json({msg:"Successfully Added!", data: savedUser._id});
    } catch(err) {
        res.json({msg:"Error!", dbErr: err});
    }
});

//login
router.post('/login',async (req,res) => {
    const reqBody    = req.body;
    // validate the user
    const {error} = loginValidations(reqBody);
    if(error) return res.status(400).json({"msg":error.details[0].message});

    // check user already exists
    const user = await User.findOne({email:reqBody.email});

    if(!user) return res.status(400).json({"msg": "User not found."});

    //Password is correct
    const validPass = await bcrypt.compare(reqBody.password,user.password);

    if(!validPass) return res.status(400).json({"msg": "Invalid Password."});

    //Create and assign token
    const token = jwt.sign({ _id:user._id }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).json({msg: "Login Successfully!",token: token});

});

module.exports = router;