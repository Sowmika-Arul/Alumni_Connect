// src/controllers/achievementController.js
const achievementService = require('../services/achievementService');

const addAchievement = async (req, res) => {
    const { title, description, date } = req.body; // Extract fields from the request body
    const { rollNo } = req.params; // Extract the roll number from the request params
    const imageFile = req.file ? req.file : null; // Get the uploaded image file (Cloudinary URL will be in req.file.path)

    // Validate required fields
    if (!title || !description) {
        return res.status(400).send('Title and description are required.');
    }

    try {
        // Call the service to add achievement with Cloudinary image URL
        const newAchievement = await achievementService.addAchievement(rollNo, title, description, date, imageFile);
        // Respond with the newly created achievement
        res.status(201).json({ achievements: [newAchievement] });
    } catch (error) {
        console.error('Error saving achievement:', error);
        res.status(500).send('Server error while saving achievement.');
    }
};

module.exports = {
    addAchievement
};
