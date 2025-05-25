// src/services/successStoryService.js
const SuccessStory = require('../models/successStoryModel'); // Adjust path to your SuccessStory model

const addSuccessStory = async (rollNo, title, story, author, imagePath) => {
    const newStory = new SuccessStory({
        rollNo,
        title,
        story,
        author,
        date: new Date(), // Use current date
       imageUrl: imagePath || null, // Just store the full URL
    });

    // Save the success story to the database
    return await newStory.save();
};

module.exports = {
    addSuccessStory
};
