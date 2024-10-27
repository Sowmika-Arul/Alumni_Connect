// Define Social Media Links Schema
const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    leetcode: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    website: { type: String }
}, { collection: 'social_media_links' });

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = SocialMedia