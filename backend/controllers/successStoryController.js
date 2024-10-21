// src/controllers/successStoryController.js
const successStoryService = require('../services/successStoryService');

const addSuccessStory = async (req, res) => {
    const { title, story, author } = req.body; // Extract fields from request body
    const { rollNo } = req.params; // Extract roll number from URL params
    const imagePath = req.file ? req.file.filename : null; // Get uploaded image filename

    // Validate required fields
    if (!title || !story || !author) {
        return res.status(400).send('Title, story, and author are required.');
    }

    try {
        // Call the service to add the success story
        const newStory = await successStoryService.addSuccessStory(rollNo, title, story, author, imagePath);
        // Respond with the newly created story
        res.status(201).json({ successStories: [newStory] });
    } catch (error) {
        console.error('Error saving success story:', error);
        res.status(500).send('Server error while saving success story.');
    }
};

module.exports = {
    addSuccessStory
};
