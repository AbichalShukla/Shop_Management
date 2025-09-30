const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    author: { type: String },
    condition: { type: String,  enum: ['New','Like New','Good','Fair','Poor'],default: 'good' },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Book', BookSchema);