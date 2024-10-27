// src/services/donationService.js
const paypal = require('paypal-rest-sdk');
const Donation = require('../models/donationModel'); // Ensure this path points to your Donation model

const createPayment = async (amount, rollNo, reason, PORT) => {
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: `http://localhost:5050/api/success?rollNo=${encodeURIComponent(rollNo)}&reason=${encodeURIComponent(reason)}`,
            cancel_url: `http://localhost:5050/api/cancel`
        },
        transactions: [{
            item_list: {
                items: [{
                    name: `Donation by ${rollNo}`,
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
                resolve(approvalUrl);
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

const saveDonation = async (rollNo, amount, reason, transactionId) => {
    const donation = new Donation({
        rollNo,
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
