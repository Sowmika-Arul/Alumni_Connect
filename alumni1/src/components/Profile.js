import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rollNo from localStorage
        const rollNo = localStorage.getItem('rollNo'); 

        if (!rollNo) {
            navigate('/login'); // Redirect to login if rollNo is not available
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5050/profile/${rollNo}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.profile);
                    setFormData(data.profile); // Set initial form data
                } else {
                    setError('Failed to fetch profile');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('rollNo'); // Clear rollNo on logout
        navigate('/');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleAddInformationClick = () => {
        navigate('/add_information'); // Route to add information page
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const rollNo = localStorage.getItem('rollNo');

        try {
            const response = await fetch(`http://localhost:5050/profile/${rollNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile.profile);
                setIsEditing(false);
                setError('');
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#1A1A1A', // Dark background
            color: '#F4F4F4', // Light text color
            padding: '20px'
        }}>
            <h2 style={{
                color: '#FFC107', // Yellow color
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '20px',
                borderBottom: '2px solid #FFA500', // Orange underline
                paddingBottom: '10px'
            }}>Profile</h2>
            <button style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: '#FFFFFF', // White text
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s',
                marginBottom: '20px'
            }} onClick={handleLogout}>Logout</button>
            {error && <p style={{
                color: '#FF0000', // Red for errors
                textAlign: 'center',
                margin: '20px 0'
            }}>{error}</p>}
            {profile ? (
                <div style={{
                    background: '#2C2C2C', // Dark gray background
                    border: '2px solid #FFC107', // Yellow border
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Strong shadow
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '600px' // Adjust as needed
                }}>
                    <div>
                        <img 
                            src={profile.photo || '/default-profile.jpg'} // Display photo URL from the database
                            alt="Profile" 
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                marginBottom: '20px'
                            }} 
                        />
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <div>
                                <label>Roll No:</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    disabled
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        backgroundColor: '#3A3A3A', // Darker gray background for inputs
                                        color: '#F4F4F4', // Light text
                                        fontSize: '14px',
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        backgroundColor: '#3A3A3A', // Darker gray background for inputs
                                        color: '#F4F4F4', // Light text
                                        fontSize: '14px',
                                        width: '100%'
                                    }}
                                />
                            </div>
                            {/* Repeat similar styling for other input fields */}
                            <button type="submit" style={{
                                backgroundColor: '#FFC107', // Yellow
                                color: '#1A1A1A', // Dark text
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                marginTop: '10px'
                            }}>Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{
                                backgroundColor: '#FFC107', // Yellow
                                color: '#1A1A1A', // Dark text
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                marginLeft: '10px'
                            }}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <p><strong>Roll No:</strong> {profile.rollNo}</p>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Batch:</strong> {profile.batch}</p>
                            <p><strong>Department:</strong> {profile.department}</p>
                            <p><strong>Specialization:</strong> {profile.specialization}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Industry:</strong> {profile.industry}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <div style={{
                                marginTop: '20px',
                                textAlign: 'center'
                            }}>
                                <button onClick={handleEditClick} style={{
                                    backgroundColor: '#FFC107', // Yellow
                                    color: '#1A1A1A', // Dark text
                                    border: 'none',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'background-color 0.3s ease, color 0.3s ease',
                                    margin: '0 10px'
                                }}>Edit</button>
                                <button onClick={handleAddInformationClick} style={{
                                    backgroundColor: '#FFC107', // Yellow
                                    color: '#1A1A1A', // Dark text
                                    border: 'none',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'background-color 0.3s ease, color 0.3s ease',
                                    margin: '0 10px'
                                }}>Add Information</button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
