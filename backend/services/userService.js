const User = require('../models/userModel'); // Correct import
const Admin = require('../models/adminModel');
const Profile = require('../models/profileModel'); // Assuming Profile model exists

const loginUser = async (rollNo, password) => {
    // Check for a regular user
    const user = await User.findOne({ rollNo });
    const profile = await Profile.findOne({ rollNo });

    if (user) {
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            // If profile exists, include rollNo and name, otherwise skip them
            const response = {
                message: 'Login successful',
                role: 'user',
            };

            if (profile) {
                response.rollNo = profile.rollNo;
                response.name = profile.name;
            }

            return response;
        }
    }

    // Check for an admin
    const admin = await Admin.findOne({ rollNo });
    if (admin) {
        const isMatch = await admin.comparePassword(password); // Secure comparison
        if (isMatch) {
            // If profile exists, include rollNo and name, otherwise skip them
            const response = {
                message: 'Admin login successful',
                role: 'admin',
            };

            if (profile) {
                response.rollNo = profile.rollNo;
                response.name = profile.name;
            }

            return response;
        }
    }

    // If no user or admin is found or passwords do not match
    throw new Error('Invalid roll number or password');
};

module.exports = { loginUser };
