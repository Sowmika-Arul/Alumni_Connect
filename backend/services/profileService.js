// src/services/profileService.js
const Profile = require('../models/profileModel'); // Make sure the path to your model is correct

const fetchProfileByRollNo = async (rollNo) => {
    return await Profile.findOne({ rollNo });
};

const updateProfileByRollNo = async (rollNo, updateData) => {
    return await Profile.findOneAndUpdate(
        { rollNo },
        updateData,
        { new: true, runValidators: true }
    );
};

module.exports = { fetchProfileByRollNo, updateProfileByRollNo };
