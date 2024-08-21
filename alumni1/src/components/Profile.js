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
        <div>
            <h2>Profile</h2>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
            {profile ? (
                <div className="profile-details">
                    <div>
                        <img 
                            src={profile.photo || '/default-profile.jpg'} // Display photo URL from the database
                            alt="Profile" 
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }} // Styling the image
                        />
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Roll No:</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Batch:</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Specialization:</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Industry:</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Photo URL:</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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
                            <button onClick={handleEditClick}>Edit</button>
                            <button onClick={handleAddInformationClick}>Add Information</button> {/* New Button */}
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
