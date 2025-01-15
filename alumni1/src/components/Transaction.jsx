// src/components/Transactions.js
import React, { useEffect, useState } from 'react';
import '../styles/Transactions.css';
import Navbar from './Navbar.jsx';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://alumni-connect-5ad6.onrender.com/api/transactions');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(`Failed to fetch transactions: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Navbar/>
            <h1>Donations by Alumni</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.rollNo}</td>
                            <td>{transaction.name || 'N/A'}</td>
                            <td>{transaction.amount}</td>
                            <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                            <td>{transaction.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
