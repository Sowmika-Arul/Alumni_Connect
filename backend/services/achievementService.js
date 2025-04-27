const Achievement = require('../models/achievementModel'); // Ensure this path points to your Achievement model

// Add Achievement Function
const addAchievement = async (rollNo, title, description, date, imageFile) => {
    try {
        // Cloudinary handles the upload and provides the image URL in the response
        const imageUrl = imageFile ? imageFile.path : null; // imageFile.path contains the Cloudinary URL after successful upload

        // Create a new achievement document
        const newAchievement = new Achievement({
            rollNo,
            title,
            description,
            date: date ? new Date(date) : new Date(), // Default to current date if not provided
            imageUrl: imageUrl // Store the Cloudinary image URL
        });

        // Save the achievement to the database
        return await newAchievement.save();
    } catch (error) {
        throw new Error('Error saving achievement: ' + error.message);
    }
};

module.exports = {
    addAchievement
};
