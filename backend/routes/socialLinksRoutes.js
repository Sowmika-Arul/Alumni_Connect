// src/routes/socialLinksRoutes.js
const express = require('express');
const router = express.Router();
const socialLinksController = require('../controllers/socialLinksController');

// Route to update social links for a specific roll number
router.put('/add_social_links/:rollNo', socialLinksController.updateSocialLinks);

module.exports = router;
