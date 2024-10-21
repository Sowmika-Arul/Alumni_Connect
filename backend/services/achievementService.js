// src/services/achievementService.js
const Achievement = require('../models/achievementModel'); // Ensure this path points to your Achievement model

const addAchievement = async (rollNo, title, description, date, imagePath) => {
    // Create a new achievement document
    const newAchievement = new Achievement({
        rollNo,
        title,
        description,
        date: date ? new Date(date) : new Date(), // Default to current date if none provided
        imageUrl: imagePath ? `uploads/${imagePath}` : null // Save the image path if uploaded
    });

    // Save the achievement to the database
    return await newAchievement.save();
};

module.exports = {
    addAchievement
};
