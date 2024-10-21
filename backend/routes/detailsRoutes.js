// src/routes/detailsRoutes.js
const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/detailsController');

// Route to get details by roll number
router.get('/details/:rollNo', detailsController.getDetails);

module.exports = router;
