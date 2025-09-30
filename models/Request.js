const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
status: { type: String, enum: ['pending','accepted','declined'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Request', RequestSchema);