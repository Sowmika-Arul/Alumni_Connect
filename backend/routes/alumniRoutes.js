// src/routes/alumniRoutes.js
const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');

// Define route for fetching alumni profiles
router.get('/alumni_list', alumniController.getAlumniList);

module.exports = router;
