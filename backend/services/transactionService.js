// services/transactionService.js
const Donation = require('../models/donationModel'); // Correct import for the model

const getAllTransactions = async () => {
    try {
        const transactions = await Donation.find()
            .populate({ path: 'rollNo', select: 'name rollNo' }) // Populate user's name and rollNo
            .exec();
        return transactions;
    } catch (error) {
        throw new Error('Error fetching transactions');
    }
};

module.exports = {
    getAllTransactions
};
