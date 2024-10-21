import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [rollNo, setRollNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5050/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rollNo, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('rollNo', rollNo);

                if (data.message === 'Login successful') {
                    // Redirect to the alumni home page
                    navigate('/home');
                } else if (data.message === 'Admin login successful') {
                    // Redirect to the admin home page
                    navigate('/adminHome');
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const styles = {
        body: {
            margin: 0,
            padding: 0,
            fontFamily: 'Arial, sans-serif',
            height: '100vh',
            background: 'url("/images/bg.png") no-repeat center center fixed',
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            color: '#333',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: 'rgba(37, 224, 224, 0.8)',
            zIndex: 2,
            width: '100%',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: 0,
        },
        headerImg: {
            height: '80px',
            marginRight: '20px',
        },
        headerText: {
            color: '#0e1010',
        },
        headerTextH1: {
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
        },
        headerTextP: {
            margin: 0,
            fontSize: '18px',
        },
        pageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
        },
        content: {
            zIndex: 2,
            width: '100%',
            maxWidth: '1200px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '100px',
        },
        backgroundOverlay: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '40px',
            height: 'auto',
            color: '#fcf9f9',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            margin: '0 20px',
            flexWrap: 'wrap',
        },
        textSection: {
            flex: 1,
            padding: '40px',
            maxWidth: '600px',
        },
        textSectionH1: {
            fontSize: '36px',
            marginBottom: '20px',
            color: '#fafad2',
        },
        textSectionP: {
            fontSize: '18px',
            marginBottom: '30px',
        },
        buttonGroup: {
            marginTop: '20px',
        },
        buttonLink: {
            padding: '10px 20px',
            background: '#25e0e0',
            color: '#0b0a0a',
            textDecoration: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonLinkHover: {
            background: '#1ec8c8',
        },
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
        inputGroupInputFocus: {
            borderColor: '#25e0e0',
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
        submitButtonHover: {
            background: '#1ec8c8',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.header}>
                <img src="/images/ab1.png" alt="Department of School Education - Government of Tamil Nadu" style={styles.headerImg} />
                <div style={styles.headerText}>
                    <h1 style={styles.headerTextH1}>Department of School Education</h1>
                    <p style={styles.headerTextP}>Government of Gujarat</p>
                </div>
            </div>

            <div style={styles.pageOverlay}></div>

            <div style={styles.content}>
                <div style={styles.backgroundOverlay}>
                    <div style={styles.textSection}>
                        <h1 style={styles.textSectionH1}>Alumni Connect</h1>
                        <p style={styles.textSectionP}>
                            You get an opportunity to connect with your alumni.<br /><br />
                            Interact and gain knowledge.
                        </p>
                        <div style={styles.buttonGroup}>
                            <a href="https://www.education.gov.in/" style={styles.buttonLink}>Education System</a>
                        </div>
                    </div>
                    <div style={styles.formContainer}>
                        <h2 style={styles.formContainerH2}>Login</h2>
                        <form onSubmit={handleLogin}>
                            <div style={styles.inputGroup}>
                                <label htmlFor="rollNo" style={styles.inputGroupLabel}>Roll Number:</label>
                                <input
                                    type="text"
                                    id="rollNo"
                                    name="rollNo"
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                    required
                                    style={styles.inputGroupInput}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label htmlFor="password" style={styles.inputGroupLabel}>Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={styles.inputGroupInput}
                                />
                            </div>
                            <button type="submit" style={styles.submitButton}>Login</button>
                            {error && <p>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
