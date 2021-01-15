const mongoose = require("mongoose");

const LogoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Logos",LogoSchema);