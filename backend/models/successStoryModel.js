// Define Success Story Schema
const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String } // optional field for image URL
}, { collection: 'success_stories' });

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);

module.exports = SuccessStory ;