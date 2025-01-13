import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

function Donate() {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDonate = async (e) => {
        e.preventDefault();

        const rollNo = localStorage.getItem('rollNo');
        const donorName = localStorage.getItem('userName');
        console.log('Roll No:', rollNo, 'Donor Name:', donorName);

        if (!rollNo || !donorName) {
            setError('Please log in to make a donation.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid donation amount.');
            return;
        }

        if (reason.trim() === '') {
            setError('Please provide a reason for your donation.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/api/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-rollno': rollNo,
                },
                body: JSON.stringify({ rollNo, donorName, amount, reason }),
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                setSuccess('Donation successful! Redirecting...');
                window.location.href = data.forwardLink;
            } else {
                setError(data.message || 'Error processing donation');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred while processing your donation.');
        }
    };

    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url('./images/donate.avif')`,
            backgroundSize: "contain",
            backgroundPosition: 'center',
            color: '#fff',
            padding: '0 40px',
        },
        leftColumn: {
            flex: 1,
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        rightColumn: {
            flex: 1,
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
        },
        description: {
            fontSize: '18px',
            lineHeight: '1.6',
        },
        inputGroup: {
            marginBottom: '15px',
        },
        inputGroupLabel: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#333',
        },
        inputGroupInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
        },
        submitButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#25e0e0',
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
            <div style={styles.container}>
                {/* Left Column */}
                <div style={styles.leftColumn}>
                    <h1 style={styles.heading}>Support Our Community</h1>
                    <p style={styles.description}>
                        Your support makes a real difference. Contributions help fund scholarships, alumni events, and
                        important initiatives that enrich our community. Together, we can give back and empower the
                        future.
                    </p>
                </div>
                {/* Right Column */}
                <div style={styles.rightColumn}>
                    <h2 style={{ ...styles.heading, color: '#333', fontSize: '28px' }}>Make a Donation</h2>
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
