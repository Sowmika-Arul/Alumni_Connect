import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
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

    return (
        <div>
            <h2>Profile</h2>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
            {profile ? (
                <div className="profile-details">
                    <p><strong>Roll No:</strong> {profile.rollNo}</p>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Batch:</strong> {profile.batch}</p>
                    <p><strong>Department:</strong> {profile.department}</p>
                    <p><strong>Specialization:</strong> {profile.specialization}</p>
                    <p><strong>Location:</strong> {profile.location}</p>
                    <p><strong>Industry:</strong> {profile.industry}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
