const express = require("express");
const router = express.Router();
const Logo = require("../models/Logo");
// Get the comany logo suggestions
// Insert Logos
router.post('/insert-logos',async (req,res) => {
    const logos    = req.body;
    console.log(logos);
    try {
        const savedLogos = await Logo.insertMany(logos);
        res.json({msg:"Successfully Added!", data: savedLogos});
    } catch(err) {
        res.json({msg:"Error!", dbErr: err});
    }
});

module.exports = router;