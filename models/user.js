const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    registered_on: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('User', userSchema);