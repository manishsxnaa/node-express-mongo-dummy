const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const verify = require('./verifyToken');
// Get all notes
router.get('/',verify, async (req,res) => {
    try{
        
        let query = req.query;
        let sort = -1;
        if(query.sort){
            sort = query.sort == "DESC"?-1:1;
        }
        console.log("sort");
        console.log(sort);
        let keyword = query.keyword?query.keyword:"";
        let perPage = 2, page = query.page?Math.max(0, query.page):0;

        let skip = page > 0?perPage * (page - 1):0;
  
        //{ title: { $regex: keyword,$options:'i' } }
        const notes = await Note.find({ $or: [ { title: { $regex: keyword,$options:'i' } }, { description: { $regex: keyword,$options:'i' } } ] }).sort({'priority':sort}).limit(perPage)
        .skip(skip)
        const totalNotes = await Note.count({ $or: [ { title: { $regex: keyword,$options:'i' } }, { description: { $regex: keyword,$options:'i' } } ] });
        let totalPages = Math.round(totalNotes / perPage);
        res.json({status:"success",msg:"", data: notes,total:totalNotes,totalPages:totalPages,perPage:perPage});
    }catch(err) {
        res.json({status:"error",msg:"No data found."});
    }
});

// Insert Note
router.post('/',async (req,res) => {
    
    const note    = req.body;
    if(!note.title || !note.description){
        res.json({status:"error",msg: "Title and Description should be include"});
    }else {
        
        const newNote = new Note({
            title: note.title,
            description: note.description,
            priority: note.priority
        });

        try {
            const savedNote = await newNote.save();
            res.json({status:"success",msg:"Successfully Added!", data: savedNote});
        } catch(err) {
            res.json({status:"error",msg:"Error!", dbErr: err});
        }
    }
});

// get specific note
router.get('/:noteId',async (req,res) => {
    try{
        let id = req.params.noteId;
        const note = await Note.findById(id);
        res.json({status:"success",msg:"", data: note});
    }catch(err) {
        res.json({msg:"No data found."});
    }
});

// remove specific note
router.delete('/:noteId',async (req,res) => {
    try{
        let id = req.params.noteId;
        const deletedNote = await Note.remove({_id:id});
        res.json({status:"success",msg:"Note has been deleted successfully.", data: deletedNote});
    }catch(err) {
        res.json({status:"error",msg:"No data found."});
    }
});

// update specific note
router.put('/:noteId',async (req,res) => {
    const note    = req.body;
    let id = req.params.noteId;
    try {
        const updatedNote = await Note.updateOne({ _id:id},{$set:{title:note.title,description:note.description,priority:note.priority}});
        res.json({status:"success",msg:"Successfully Updated!", data: updatedNote});
    } catch(err) {
        res.json({status:"error",msg:"Error!", dbErr: err});
    }
    
});

module.exports = router;