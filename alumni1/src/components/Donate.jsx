import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

function Donate() {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle donation
    const handleDonate = async (e) => {
        e.preventDefault();

        const rollNo = localStorage.getItem('rollNo');
        const donorName = localStorage.getItem('userName'); // Retrieve name from local storage
        console.log('Roll No:', rollNo, 'Donor Name:', donorName); // Log for debugging

        // Check if user is logged in
        if (!rollNo || !donorName) {
            setError('Please log in to make a donation.');
            return;
        }

        // Validate donation amount
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid donation amount.');
            return;
        }

        // Validate reason for donation
        if (reason.trim() === '') {
            setError('Please provide a reason for your donation.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/api/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-rollno': rollNo, // Assuming you use roll number as part of the auth
                },
                body: JSON.stringify({ rollNo, donorName, amount, reason }), // Include donor name in the body
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                setSuccess('Donation successful! Redirecting...');
                window.location.href = data.forwardLink; // Redirect to PayPal
            } else {
                setError(data.message || 'Error processing donation');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred while processing your donation.');
        }
    };

    const styles = {
        pageContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
        },
        formContainer: {
            width: '400px',
            padding: '30px',
            background: '#fafad2',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
        },
        formContainerH2: {
            marginBottom: '20px',
            color: '#333',
            textAlign: 'center',
        },
        description: {
            marginBottom: '20px',
            color: '#555',
            fontSize: '14px',
            textAlign: 'center',
        },
        inputGroup: {
            marginBottom: '15px',
        },
        inputGroupLabel: {
            display: 'block',
            marginBottom: '5px',
            color: '#555',
        },
        inputGroupInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            background: 'transparent',
            color: '#333',
        },
        submitButton: {
            width: '100%',
            padding: '10px',
            background: '#25e0e0',
            color: '#0e0e0e',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        errorMessage: {
            color: 'red',
            marginTop: '10px',
            textAlign: 'center',
        },
        successMessage: {
            color: 'green',
            marginTop: '10px',
            textAlign: 'center',
        },
    };

    return (
        <div>
            <Navbar />
            <div style={styles.pageContainer}>
                <div style={styles.formContainer}>
                    <h2 style={styles.formContainerH2}>Make a Donation</h2>
                    <p style={styles.description}>
                        Your support makes a real difference. Contributions help fund scholarships, alumni events, and
                        important initiatives that enrich our community. Together, we can give back and empower the
                        future.
                    </p>
                    <form onSubmit={handleDonate}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="amount" style={styles.inputGroupLabel}>Donation Amount:</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                style={styles.inputGroupInput}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="reason" style={styles.inputGroupLabel}>Reason for Donation:</label>
                            <input
                                type="text"
                                id="reason"
                                name="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                style={styles.inputGroupInput}
                            />
                        </div>
                        <button type="submit" style={styles.submitButton}>Donate</button>
                        {error && <p style={styles.errorMessage}>{error}</p>}
                        {success && <p style={styles.successMessage}>{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Donate;
