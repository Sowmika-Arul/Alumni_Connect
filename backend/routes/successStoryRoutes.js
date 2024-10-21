// src/routes/successStoryRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Middleware for file uploads
const successStoryController = require('../controllers/successStoryController');

// Route to add a success story
router.post('/add_success_story/:rollNo', upload.single('image'), successStoryController.addSuccessStory);

module.exports = router;
