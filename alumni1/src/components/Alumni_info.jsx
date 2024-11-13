import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Alumni_info.css';

function AlumniDetails() {
    const { rollNo } = useParams(); // Get the roll number from the URL
    const [profile, setProfile] = useState({
        achievements: [],
        successStories: [],
        social_media_links: []  // Initialize as an empty array
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5050/api/details/${rollNo}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched Profile Data: ", data); // Log the fetched data to check its structure
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

    // Get the first object in the social_media_links array, if it exists
    const socialMediaLinks = profile.social_media_links[0] || {};

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
                <ul className="social-media-list">
                    {socialMediaLinks.leetcode && (
                        <li className="social-media-item">
                            <a href={socialMediaLinks.leetcode} target="_blank" rel="noopener noreferrer">
                                Leetcode
                            </a>
                        </li>
                    )}
                    {socialMediaLinks.linkedin && (
                        <li className="social-media-item">
                            <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                    )}
                    {socialMediaLinks.github && (
                        <li className="social-media-item">
                            <a href={socialMediaLinks.github} target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                        </li>
                    )}
                    {socialMediaLinks.portfolio && (
                        <li className="social-media-item">
                            <a href={socialMediaLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                Portfolio
                            </a>
                        </li>
                    )}
                    {socialMediaLinks.resume && (
                        <li className="social-media-item">
                            <a href={socialMediaLinks.resume} target="_blank" rel="noopener noreferrer">
                                Resume
                            </a>
                        </li>
                    )}
                    {/* Show "No social media links" if all links are missing */}
                    {Object.keys(socialMediaLinks).length === 0 && (
                        <p>No social media links available.</p>
                    )}
                </ul>
            </div>

            <button className="back-button" onClick={handleBack}>Back to Alumni List</button>
        </div>
    );
}

export default AlumniDetails;
