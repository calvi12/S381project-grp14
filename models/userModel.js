const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true, 
    }
});

module.exports = userSchema;