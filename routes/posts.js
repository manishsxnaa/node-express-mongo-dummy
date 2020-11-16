const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verify = require('./verifyToken');
// Get all posts
router.get('/',verify, async (req,res) => {
    try{
        const posts = await Post.find().limit(5);
        res.json({msg:"", data: posts});
    }catch(err) {
        res.json({msg:"No data found."});
    }
});

// Insert post
router.post('/',async (req,res) => {
    const post    = req.body;
    if(!post.title || !post.description){
        res.json({msg: "title and description should be include"});
    }else {
        const newPost = new Post({
            title: post.title,
            description: post.description
        });

        try {
            const savedPost = await newPost.save();
            res.json({msg:"Successfully Added!", data: savedPost});
        } catch(err) {
            res.json({msg:"Error!", dbErr: err});
        }

        // newPost.save()
        // .then(data => {
        //     res.status(200).json({msg:"Successfully Added!"});
        // })
        // .catch(err => {
        //     res.status(404).json({msg:"Error!"});
        // })
        
    }
});

// get specific post
router.get('/:postId',async (req,res) => {
    try{
        let id = req.params.postId;
        const post = await Post.findById(id);
        res.json({msg:"", data: post});
    }catch(err) {
        res.json({msg:"No data found."});
    }
});

// remove specific post
router.delete('/:postId',async (req,res) => {
    try{
        let id = req.params.postId;
        const deletedPost = await Post.remove({_id:id});
        res.json({msg:"Post has been deleted successfully.", data: deletedPost});
    }catch(err) {
        res.json({msg:"No data found."});
    }
});

// update specific post
router.put('/:postId',async (req,res) => {
    const post    = req.body;
    let id = req.params.postId;
    try {
        const updatedPost = await Post.updateOne({ _id:id},{$set:{title:post.title,description:post.description}});
        res.json({msg:"Successfully Updated!", data: updatedPost});
    } catch(err) {
        res.json({msg:"Error!", dbErr: err});
    }
    
});

module.exports = router;