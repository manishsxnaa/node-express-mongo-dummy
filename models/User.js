const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Users",UserSchema);