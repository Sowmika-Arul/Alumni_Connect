import React, { useState } from 'react';

function Donate() {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle donation
    const handleDonate = async (e) => {
        e.preventDefault();

        const rollNo = localStorage.getItem('rollNo');
        console.log(rollNo); // Retrieve the roll number from local storage

        if (!rollNo) {
            setError('Please log in to make a donation.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid donation amount.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-rollno': rollNo, // Assuming you use roll number as part of the auth
                },
                body: JSON.stringify({ rollNo, amount }), // Include rollNo in the body
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Donation successful! Redirecting...');
                window.location.href = data.forwardLink; // Redirect to PayPal
            } else {
                setError(data.message || 'Error processing donation');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const styles = {
        formContainer: {
            width: '350px',
            padding: '30px',
            background: '#fafad2',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
            marginRight: '20px',
            transition: 'transform 0.3s, box-shadow 0.3s',
        },
        formContainerH2: {
            marginBottom: '20px',
            color: '#333',
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
            outline: 'none',
            transition: 'border-color 0.3s',
        },
        submitButton: {
            width: '100%',
            padding: '10px',
            background: '#25e0e0',
            color: '#0e0e0e',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
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
        <div style={styles.formContainer}>
            <h2 style={styles.formContainerH2}>Make a Donation</h2>
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
                <button type="submit" style={styles.submitButton}>Donate</button>
                {error && <p style={styles.errorMessage}>{error}</p>}
                {success && <p style={styles.successMessage}>{success}</p>}
            </form>
        </div>
    );
}

export default Donate;
