// src/routes/achievementRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinaryConfig'); // Middleware to handle file uploads
const achievementController = require('../controllers/achievementController');

// Route to add an achievement with image upload
router.post('/add_achievement/:rollNo', upload.single('image'), achievementController.addAchievement);

module.exports = router;
