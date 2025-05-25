// src/controllers/successStoryController.js
const successStoryService = require('../services/successStoryService');

const addSuccessStory = async (req, res) => {
    const { title, story, author, image } = req.body; // Include image URL from body
const { rollNo } = req.params;

// Validate required fields
if (!title || !story || !author) {
    return res.status(400).send('Title, story, and author are required.');
}

try {
    const newStory = await successStoryService.addSuccessStory(rollNo, title, story, author, image); // Pass image URL directly
    res.status(201).json({ successStories: [newStory] });
} catch (error) {
    console.error('Error adding success story:', error);
    res.status(500).send('Internal server error');
}
};

module.exports = {
    addSuccessStory
};
