// AlumniList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AlumniList() {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:5050/alumni_list');

                if (response.ok) {
                    const data = await response.json();
                    setProfiles(data.profiles);
                } else {
                    setError('Failed to fetch alumni profiles');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchProfiles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        navigate('/');
    };

    return (
        <div>
            <h2>Alumni List</h2>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
            <ul>
                {profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <li key={profile.rollNo}>
                            <p><strong>Roll No:</strong> {profile.rollNo}</p>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Batch:</strong> {profile.batch}</p>
                            <p><strong>Department:</strong> {profile.department}</p>
                            <p><strong>Specialization:</strong> {profile.specialization}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Industry:</strong> {profile.industry}</p>
                            <hr />
                        </li>
                    ))
                ) : (
                    <p>No profiles available</p>
                )}
            </ul>
        </div>
    );
}

export default AlumniList;
