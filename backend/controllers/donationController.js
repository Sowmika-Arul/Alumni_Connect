// src/controllers/donationController.js
const donationService = require('../services/donationService');

const donate = async (req, res) => {
    const { amount, rollNo, reason } = req.body;

    if (!amount || !rollNo || !reason) {
        return res.status(400).json({ message: 'Donation amount, roll number, and reason are required' });
    }

    try {
        const approvalUrl = await donationService.createPayment(amount, rollNo, reason, process.env.PORT || 3000);
        res.json({ forwardLink: approvalUrl });
    } catch (error) {
        console.error('PayPal payment creation error:', error);
        res.status(500).json({ message: 'Error creating PayPal payment', error: error.message });
    }
};

const paymentSuccess = async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const rollNo = req.query.rollNo || 'Anonymous';
    const reason = req.query.reason || 'No reason provided';

    try {
        const payment = await donationService.executePayment(payerId, paymentId);
        const amount = payment.transactions[0].amount.total;
        const transactionId = payment.id;

        await donationService.saveDonation(rollNo, amount, reason, transactionId);
        res.json({ message: 'Thank you for your donation!' });
    } catch (error) {
        console.error('Payment success error:', error);
        res.status(500).json({ message: 'Payment failed', error: error.message });
    }
};

const cancel = (req, res) => {
    res.json({ message: 'Payment canceled' });
};

module.exports = {
    donate,
    paymentSuccess,
    cancel
};
