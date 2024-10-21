// src/models/userModel.js
const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'login' });

// Add a method to compare passwords (simple string comparison)
userSchema.methods.comparePassword = function (enteredPassword) {
    return enteredPassword === this.password; // Direct comparison of plain-text passwords
};

// Create and export the model directly
const User = mongoose.model('User', userSchema);
module.exports = User;
