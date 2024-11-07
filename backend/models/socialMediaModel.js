// Define Social Media Links Schema
const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true }, 
    leetcode: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    resume: { type: String }
}, { collection: 'social_media_links' });

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = SocialMedia