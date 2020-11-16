const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

//Import Posts
const postsRoutes = require('./routes/posts');
//Import Users
const authRoutes = require('./routes/auth');

// ** Middleware ** 
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// Post Route
app.use('/posts',postsRoutes);
// User Route
app.use('/users',authRoutes);

// app.use('/posts',() => {
//     console.log("Middleware running..");
// });

// Routes
app.get('/',(req,res) => {
    res.send("Welcome");
});

//connect to db
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log("connected to Db!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);