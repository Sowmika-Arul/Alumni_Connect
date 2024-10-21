// src/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Donate route
router.post('/donate', donationController.donate);

// Success route for PayPal
router.get('/success', donationController.paymentSuccess);

// Cancel route
router.get('/cancel', donationController.cancel);

module.exports = router;
