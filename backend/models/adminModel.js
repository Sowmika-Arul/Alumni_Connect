const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'Admin_Login' });

// Add a method to compare passwords (simple string comparison)
adminSchema.methods.comparePassword = function (enteredPassword) {
    return enteredPassword === this.password; // Direct comparison of plain-text passwords
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin