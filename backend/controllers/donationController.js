// src/controllers/donationController.js
const donationService = require('../services/donationService');

const donate = async (req, res) => {
    const { amount, rollNo,  donorName, reason } = req.body;
    console.log(req.body);

    if (!amount || !rollNo || !donorName || !reason) {
        console.error('Validation Error: Missing required fields for donation:', { amount, rollNo, donorName, reason });
        return res.status(400).json({ message: 'Donation amount, roll number, name, and reason are required' });
    }

    try {
        const { approvalUrl, transactionId } = await donationService.createPayment(amount, rollNo, donorName, reason, process.env.PORT || 3000);
        
        await donationService.saveDonation(rollNo, donorName, amount, reason, transactionId);
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
    const donorName = req.query.donorName || 'Anonymous'; // Ensure donorName is defined
    console.log(rollNo, paymentId, reason, donorName);

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

        await donationService.saveDonation(rollNo, donorName, amount, reason, transactionId);
        res.json({ message: 'Thank you for your donation!' });
    } catch (error) {
        console.error('Payment success error:', error);
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
