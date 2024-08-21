import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AlumniDetails.css'; // Import the CSS file

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
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="alumni-details-container">
            <h2>Alumni Details</h2>
            {profile ? (
                <div>
                    <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                    <p><strong>LinkedIn:</strong> <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer">{profile.linkedIn}</a></p>
                    <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a></p>
                    <p><strong>LeetCode:</strong> <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">{profile.leetcode}</a></p>
                    
                    <div>
                        <h3>Achievements</h3>
                        <div className="achievements-container">
                            {profile.achievements.map((achievement, index) => (
                                <div className="achievement-box" key={index}>
                                    {achievement}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3>Success Stories</h3>
                        <div className="success-stories-container">
                            {profile.successStory.map((story, index) => (
                                <div className="success-story-box" key={index}>
                                    {story}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="back-button" onClick={handleBack}>Back to List</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default AlumniDetails;
