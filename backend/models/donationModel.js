const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    transactionId: { type: String, required: true },   
    timestamp: { type: Date, default: Date.now }
}, { collection: 'Donations' });


const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation