import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Alumni_info.css';

function AlumniDetails() {
    const { rollNo } = useParams(); // Get the roll number from the URL
    const [profile, setProfile] = useState({ achievements: [], successStories: [], social_media_links: [] });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5050/api/details/${rollNo}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.profile || { achievements: [], successStories: [], social_media_links: [] });
                } else {
                    setError('Failed to fetch alumni details');
                }
            } catch (err) {
                console.error(err); // Log error for debugging
                setError('An error occurred');
            }
        };

        fetchProfileDetails();
    }, [rollNo]);

    const handleBack = () => {
        navigate('/alumni_list'); // Navigate back to alumni list
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="alumni-details-wrapper">
            <h2 className="details-title">Achievements and Success Stories of Alumni</h2>
            <p className="details-description">
                Explore the remarkable achievements and inspiring success stories of our alumni. Here you can find their milestones and contributions in their respective fields.
            </p>

            {/* Achievements Card */}
            <div className="achievements-container achievements-card">
                <h3 className="card-title">Achievements</h3>
                {Array.isArray(profile.achievements) && profile.achievements.length > 0 ? (
                    <ul className="achievements-list">
                        {profile.achievements.map((achievement, index) => (
                            <li key={index} className="achievement-item">
                                <div className="author-name">{achievement.author}</div>
                                <div className="achievement-title"><strong>{achievement.title}</strong></div>
                                {achievement.imageUrl && <img src={achievement.imageUrl} alt={achievement.title} className="achievement-image" />}
                                <div className="achievement-description">{achievement.description}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No achievements available.</p>
                )}
            </div>

            {/* Success Stories Card */}
            <div className="success-stories-container success-stories-card">
                <h3 className="card-title">Success Stories</h3>
                {Array.isArray(profile.successStories) && profile.successStories.length > 0 ? (
                    <ul className="success-stories-list">
                        {profile.successStories.map((story, index) => (
                            <li key={index} className="story-item">
                                <div className="story-title"><strong>{story.title}</strong></div>
                                <div className="author-name">{story.author}</div>
                                {story.imageUrl && <img src={story.imageUrl} alt={story.title} className="story-image" />}
                                <div className="story-description">{story.story}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No success stories available.</p>
                )}
            </div>

            {/* Social Media Links Card */}
            <div className="social-media-container">
                <h3 className="card-title">Social Media Links</h3>
                {Array.isArray(profile.social_media_links) && profile.social_media_links.length > 0 ? (
                    <ul className="social-media-list">
                        {profile.social_media_links.map((link, index) => (
                            <li key={index} className="social-media-item">
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.platform} {/* Display the platform name */}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No social media links available.</p>
                )}
            </div>

            <button className="back-button" onClick={handleBack}>Back to Alumni List</button>
        </div>
    );
}

export default AlumniDetails;
