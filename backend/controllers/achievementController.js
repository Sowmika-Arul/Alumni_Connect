const achievementService = require('../services/achievementService');

const addAchievement = async (req, res) => {
    const { title, description, date,image } = req.body; // Extract fields from the request body
    const { rollNo } = req.params; // Extract the roll number from the request params

    // Validate required fields
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    try {
        // Call the service to add achievement with Cloudinary image URL
        const newAchievement = await achievementService.addAchievement(rollNo, title, description, date, image);
        // Respond with the newly created achievement
        res.status(201).json({ achievement: [newAchievement] });
    } catch (error) {
        console.error('Error saving achievement:', error);
        res.status(500).json({ error: 'Server error while saving achievement.' });
    }
};

module.exports = {
    addAchievement
};
