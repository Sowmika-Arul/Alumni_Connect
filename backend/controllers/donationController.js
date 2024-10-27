// src/controllers/donationController.js
const donationService = require('../services/donationService');

const donate = async (req, res) => {
    const { amount, rollNo, reason } = req.body;
    console.log(req.body);

    if (!amount || !rollNo || !reason) {
        console.error('Validation Error: Missing required fields for donation:', { amount, rollNo, reason });
        return res.status(400).json({ message: 'Donation amount, roll number, and reason are required' });
    }

    try {
        const approvalUrl = await donationService.createPayment(amount, rollNo, reason, process.env.PORT || 3000);
        res.json({ forwardLink: approvalUrl });
    } catch (error) {
        console.error('PayPal payment creation error:', error); // Log the error details
        res.status(500).json({ message: 'Error creating PayPal payment', error: error.message });
    }
};

const paymentSuccess = async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const rollNo = req.query.rollNo || 'Anonymous';
    const reason = req.query.reason || 'No reason provided';
    console.log(rollNo,paymentId,reason);

    if (!payerId || !paymentId) {
        console.error('Error: Missing PayerID or paymentId in the request:', { payerId, paymentId });
        return res.status(400).json({ message: 'Missing PayerID or paymentId' });
    }

    try {
        const payment = await donationService.executePayment(payerId, paymentId);
        
        if (!payment || !payment.transactions || payment.transactions.length === 0) {
            console.error('Error: Payment execution failed, no transactions found:', { payerId, paymentId });
            return res.status(500).json({ message: 'Payment execution failed, no transactions found' });
        }

        const amount = payment.transactions[0].amount.total;
        const transactionId = payment.id;

        await donationService.saveDonation(rollNo, amount, reason, transactionId);
        res.json({ message: 'Thank you for your donation!' });
    } catch (error) {
        console.error('Payment success error:', error); // Log the error details
        res.status(500).json({ message: 'Payment failed', error: error.message });
    }
};

const cancel = (req, res) => {
    console.log('Payment canceled by user');
    res.json({ message: 'Payment canceled' });
};

module.exports = {
    donate,
    paymentSuccess,
    cancel
};
