// controllers/transactionController.js
const transactionService = require('../services/transactionService');

const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        console.error('Error in transactionController:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTransactions
};
