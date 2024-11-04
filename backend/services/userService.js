// src/services/userService.js
const User = require('../models/userModel'); // Correct import
const Admin = require('../models/adminModel'); // Assuming Admin model exists

const loginUser = async (rollNo, password) => {
    // Check for a regular user
    const user = await User.findOne({ rollNo });
  
    if (user && user.comparePassword(password)) { // Simple comparison
        return { message: 'Login successful', role: 'user', rollNo };
    }

    // Check for an admin
    const admin = await Admin.findOne({ rollNo });
    if (admin && admin.comparePassword(password)) {
        return { message: 'Admin login successful', role: 'admin', rollNo };
    }

    // If no user or admin is found
    throw new Error('Invalid roll number or password');
};

module.exports = { loginUser };
