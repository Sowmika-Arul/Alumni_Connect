// src/services/donationService.js
const paypal = require('paypal-rest-sdk');
const Donation = require('../models/donationModel'); // Ensure this path points to your Donation model

// PayPal configuration
paypal.configure({
    'mode': 'sandbox', // Change to 'live' for production
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const createPayment = async (amount, rollNo, donorName, reason, PORT) => {
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: `http://localhost:${PORT}/api/success?rollNo=${encodeURIComponent(rollNo)}&reason=${encodeURIComponent(reason)}&donorName=${encodeURIComponent(donorName)}`,
            cancel_url: `http://localhost:${PORT}/api/cancel`
        },
        transactions: [{
            item_list: {
                items: [{
                    name: `Donation by ${donorName}`,
                    sku: '001',
                    price: amount,
                    currency: 'USD',
                    quantity: 1
                }]
            },
            amount: {
                currency: 'USD',
                total: amount
            },
            description: 'Alumni donation'
        }]
    };

    return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                reject(error);
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                const transactionId = payment.id;
                resolve({ approvalUrl, transactionId });
            }
        });
    });
};

const executePayment = async (payerId, paymentId) => {
    return new Promise((resolve, reject) => {
        paypal.payment.get(paymentId, (error, payment) => {
            if (error) {
                reject(error);
            } else {
                const amount = payment.transactions[0].amount.total;
                const execute_payment_json = {
                    payer_id: payerId,
                    transactions: [{
                        amount: {
                            currency: 'USD',
                            total: amount
                        }
                    }]
                };

                paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(payment);
                    }
                });
            }
        });
    });
};

const saveDonation = async (rollNo, donorName, amount, reason, transactionId) => {
    // Check if the donation already exists
    const existingDonation = await Donation.findOne({ transactionId });
    if (existingDonation) {
        console.log('Duplicate donation attempt:', { rollNo, donorName, amount, reason, transactionId });
        return; // Or handle as necessary, e.g., throw an error or return a message
    }

    const donation = new Donation({
        rollNo,
        name: donorName,
        amount,
        reason,
        transactionId
    });
    return await donation.save();
};

module.exports = {
    createPayment,
    executePayment,
    saveDonation
};
