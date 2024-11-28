const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        require: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = productSchema;
