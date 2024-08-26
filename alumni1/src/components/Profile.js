import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const rollNo = localStorage.getItem('rollNo');

        if (!rollNo) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5050/profile/${rollNo}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.profile);
                    setFormData(data.profile);
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
        localStorage.removeItem('rollNo');
        navigate('/');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleAddInformationClick = () => {
        navigate('/add_information');
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
        <div className="profile-container">
            <h2 className="profile-header">Profile</h2>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
            {error && <p className="error-message">{error}</p>}
            {profile ? (
                <div className="profile-details">
                    <div>
                        <img
                            src={profile.photo || '/default-profile.jpg'}
                            alt="Profile"
                            className="profile-image"
                        />
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Roll No:</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    disabled
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Batch:</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialization:</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Industry:</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" className="save-button">
                                Save
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
                                Cancel
                            </button>
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
                            <div className="profile-buttons">
                                <button onClick={handleEditClick} className="edit-button">
                                    Edit
                                </button>
                                <button onClick={handleAddInformationClick} className="add-info-button">
                                    Add Information
                                </button>
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
