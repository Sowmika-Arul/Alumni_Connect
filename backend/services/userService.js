const User = require('../models/userModel'); // Correct import
const Admin = require('../models/adminModel');
const Profile = require('../models/profileModel'); // Assuming Admin model exists

const loginUser = async (rollNo, password) => {
    // Check for a regular user
    const user = await User.findOne({ rollNo });
    const profile = await Profile.findOne({rollNo});
    
    if (user) {
        const isMatch = await user.comparePassword(password); // Secure comparison
        if (isMatch) {
            return { 
                message: 'Login successful', 
                role: 'user', 
                rollNo: profile.rollNo,
                name: profile.name // Return the user's name
            };
        }
    }

    // Check for an admin
    const admin = await Admin.findOne({ rollNo });
    if (admin) {
        const isMatch = await admin.comparePassword(password); // Secure comparison
        if (isMatch) {
            return { 
                message: 'Admin login successful', 
                role: 'admin', 
                rollNo: Profile.rollNo,
                name: Profile.name // Return the admin's name
            };
        }
    }

    // If no user or admin is found or passwords do not match
    throw new Error('Invalid roll number or password');
};

module.exports = { loginUser };
