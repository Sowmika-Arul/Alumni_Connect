const mongoose = require('mongoose');

// Define the schema for the Video model
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    userName: { type: String, required: true }, // Store the user's name
    domain: { type: String, required: true }, // Add the domain field
});

// Create and export the Video model
const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
