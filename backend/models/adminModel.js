const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'Admin_Login' });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin