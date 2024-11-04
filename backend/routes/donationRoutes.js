// src/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const transactionController = require('../controllers/transactionController');

// Donate route
router.post('/donate', donationController.donate);

// Success route for PayPal
router.get('/success', donationController.paymentSuccess);

// Cancel route
router.get('/cancel', donationController.cancel);

router.get('/transactions', transactionController.getTransactions);


module.exports = router;
