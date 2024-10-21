// src/controllers/profileController.js
const profileService = require('../services/profileService');

const getProfileByRollNo = async (req, res) => {
    const { rollNo } = req.params;

    try {
        const profile = await profileService.fetchProfileByRollNo(rollNo);

        if (profile) {
            res.status(200).json({ profile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

const updateProfileByRollNo = async (req, res) => {
    const { rollNo } = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await profileService.updateProfileByRollNo(rollNo, updateData);

        if (updatedProfile) {
            res.status(200).json({ profile: updatedProfile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

module.exports = { getProfileByRollNo, updateProfileByRollNo };
