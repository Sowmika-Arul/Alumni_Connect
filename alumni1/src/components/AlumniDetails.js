import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AlumniDetails() {
    const { rollNo } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5050/get_information/${rollNo}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    setError('Failed to fetch alumni details');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchProfile();
    }, [rollNo]);

    const handleBack = () => {
        navigate('/alumni_list');
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Alumni Details</h2>
            {profile ? (
                <div>
                    <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                    <p><strong>LinkedIn:</strong> <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer">{profile.linkedIn}</a></p>
                    <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a></p>
                    <p><strong>LeetCode:</strong> <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">{profile.leetcode}</a></p>
                    
                    <div>
                        <h3>Achievements</h3>
                        <ul>
                            {profile.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Success Stories</h3>
                        <ul>
                            {profile.successStory.map((story, index) => (
                                <li key={index}>{story}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={handleBack}>Back to List</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default AlumniDetails;
