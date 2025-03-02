const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinaryConfig'); // ✅ Import from cloudinaryConfig.js
const successStoryController = require('../controllers/successStoryController');

// Route to add a success story with image upload
router.post('/add_success_story/:rollNo', upload.single('image'), successStoryController.addSuccessStory);

module.exports = router;
