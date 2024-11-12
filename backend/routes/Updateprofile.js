const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');

// PUT request to update profile
router.put('/edit_profile/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const { name, email, batch, department, specialization, location, industry } = req.body;

    try {
        const profile = await Profile.findOneAndUpdate(
            { rollNo: rollNo }, // Find the profile by rollNo
            {
                $set: {
                    name,
                    email,
                    batch,
                    department,
                    specialization,
                    location,
                    industry
                }
            },
            { new: true } // Return the updated document
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile. Please try again later.' });
    }
});

module.exports = router;
