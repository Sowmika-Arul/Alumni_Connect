import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import '../styles/styles.css'; // Import CSS for styling

function Donate() {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDonate = async (e) => {
        e.preventDefault();

        const rollNo = localStorage.getItem('rollNo');
        const donorName = localStorage.getItem('userName');

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

            if (response.ok) {
                setSuccess('Donation successful! Redirecting...');
                window.location.href = data.forwardLink;
            } else {
                setError(data.message || 'Error processing donation');
            }
        } catch (err) {
            setError('An error occurred while processing your donation.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                {/* Image Section */}
                <div className="image-section">
                    <img
                        src="/images/donation.webp"
                        alt="Donation"
                        className="image"
                    />
                </div>

                {/* Form Section */}
                <div className="form-section">
                    <h2><center>Make a Difference</center></h2>
                    <p><center>
                        Your support makes a real difference. Contributions help fund scholarships, alumni events, and
                        important initiatives that enrich our community. Together, we can give back and empower the
                        future.
                        </center>
                    </p>
                    <form onSubmit={handleDonate}>
                        <div className="input-group">
                            <label htmlFor="amount">Donation Amount:</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="reason">Purpose of Giving:</label>
                            <input
                                type="text"
                                id="reason"
                                name="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Donate</button>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Donate;
