const mongoose = require("mongoose");

// without Validation
// const PostSchema = mongoose.Schema({
//     title : String,
//     description: String,
//     created: Date.now
// });

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Posts",PostSchema);