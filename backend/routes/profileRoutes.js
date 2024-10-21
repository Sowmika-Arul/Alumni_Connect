// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Fetch user profile by roll number
router.get('/profile/:rollNo', profileController.getProfileByRollNo);

// Update profile by roll number
router.put('/profile/:rollNo', profileController.updateProfileByRollNo);

module.exports = router;
