const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    name: { type: String },
    batch: { type: String },
    department: { type: String },
    specialization: { type: String },
    location: { type: String },
    industry: { type: String },
    photo: { type: String },
    email: { type: String },
}, { collection: 'Alumni_Profile' });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile