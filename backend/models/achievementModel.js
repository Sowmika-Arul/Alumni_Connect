const mongoose = require('mongoose');

// Define Achievement Schema
const achievementSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String } // optional field for image URL
}, { collection: 'achievements' });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement ;