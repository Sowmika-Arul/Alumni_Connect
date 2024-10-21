// src/controllers/achievementController.js
const achievementService = require('../services/achievementService');

const addAchievement = async (req, res) => {
    const { title, description, date } = req.body; // Extract fields from the request body
    const { rollNo } = req.params; // Extract the roll number from the request params
    const imagePath = req.file ? req.file.filename : null; // Get uploaded image filename

    // Validate required fields
    if (!title || !description) {
        return res.status(400).send('Title and description are required.');
    }

    try {
        // Call the service to add achievement
        const newAchievement = await achievementService.addAchievement(rollNo, title, description, date, imagePath);
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
