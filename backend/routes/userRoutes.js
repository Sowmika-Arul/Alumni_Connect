// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define login route
router.post('/login', userController.login);

module.exports = router;
