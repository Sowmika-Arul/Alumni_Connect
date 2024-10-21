import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [successStories, setSuccessStories] = useState([]);
    const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '', leetcode: '' });
    const [activeTab, setActiveTab] = useState("successStories");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [newAchievement, setNewAchievement] = useState('');
    const [newSuccessStory, setNewSuccessStory] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [newLinkedIn, setNewLinkedIn] = useState('');
    const [newGithub, setNewGithub] = useState('');
    const [newLeetcode, setNewLeetcode] = useState('');

    useEffect(() => {
        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            console.error('Roll number not found in local storage');
            return;
        }

        const fetchProfileData = async () => {
            try {
                const profileResponse = await fetch(`http://localhost:5050/api/profile/${rollNo}`);
                if (!profileResponse.ok) throw new Error(`Error ${profileResponse.status}: ${profileResponse.statusText}`);
                const profileData = await profileResponse.json();
                setProfile(profileData.profile);
                setLoadingProfile(false);

                const infoResponse = await fetch(`http://localhost:5050/api/details/${rollNo}`);
                if (!infoResponse.ok) throw new Error(`Error ${infoResponse.status}: ${infoResponse.statusText}`);
                const infoData = await infoResponse.json();
                setAchievements(infoData.achievements || []);
                setSuccessStories(infoData.successStories || []);
                // setSocialLinks(infoData.socialLinks || { linkedin: '', github: '', leetcode: '' });
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch profile data. Please try again later.');
            }
        };

        fetchProfileData();
    }, []);

    // Function to handle adding achievements
    const handleAddAchievement = async () => {
        const rollNo = localStorage.getItem('rollNo');
        try {
            const formData = new FormData();
            formData.append('title', newTitle); // Include title
            formData.append('description', newAchievement); // Description
            if (newImage) formData.append('image', newImage); // Include image if exists
            formData.append('date', new Date().toISOString()); // Set the date to now

            const response = await fetch(`http://localhost:5050/add_achievement/${rollNo}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const updatedData = await response.json();
            setAchievements(updatedData.achievements); // Update the achievements list
            resetAchievementFields(); // Reset input fields after submission
        } catch (error) {
            console.error('Error adding achievement:', error);
            setError('Failed to add achievement. Please try again.');
        }
    };

    // Function to handle adding success stories
    const handleAddSuccessStory = async () => {
        const rollNo = localStorage.getItem('rollNo');
        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            formData.append('story', newSuccessStory);
            formData.append('author', profile.name);
            formData.append('date', new Date().toISOString());
            if (newImage) formData.append('image', newImage);

            const response = await fetch(`http://localhost:5050/add_success_story/${rollNo}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const updatedData = await response.json();
            setSuccessStories(updatedData.successStories); // Update success stories
            resetSuccessStoryFields();
        } catch (error) {
            console.error('Error adding success story:', error);
            setError('Failed to add success story. Please try again.');
        }
    };

    // Function to handle adding/updating social links
    const handleAddSocialLinks = async () => {
        const rollNo = localStorage.getItem('rollNo');
        try {
            const socialData = {
                linkedin: newLinkedIn || socialLinks.linkedin,
                github: newGithub || socialLinks.github,
                leetcode: newLeetcode || socialLinks.leetcode,
            };

            const response = await fetch(`http://localhost:5050/add_social_links/${rollNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(socialData),
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const updatedLinks = await response.json();
            setSocialLinks(updatedLinks.socialLinks); // Update social links
            resetSocialLinkFields();
        } catch (error) {
            console.error('Error updating social links:', error);
            setError('Failed to update social links. Please try again.');
        }
    };

    // Reset field functions
    const resetAchievementFields = () => {
        setNewTitle(''); // Reset new title
        setNewAchievement(''); // Reset new achievement description
        setNewImage(null); // Reset new image
    };

    const resetSuccessStoryFields = () => {
        setNewSuccessStory(''); // Reset new success story
        setNewImage(null); // Reset new image
        setNewTitle(''); // Reset title
    };

    const resetSocialLinkFields = () => {
        setNewLinkedIn(''); // Reset LinkedIn URL
        setNewGithub(''); // Reset GitHub URL
        setNewLeetcode(''); // Reset LeetCode URL
    };

    // Render functions for different sections
    const renderContent = () => {
        switch (activeTab) {
            case "successStories":
                return renderSuccessStories();
            case "achievements":
                return renderAchievements();
            case "socialLinks":
                return renderSocialLinks();
            default:
                return null;
        }
    };

    const renderSuccessStories = () => (
        <div>
            <h3>Success Stories</h3>
            {successStories.length > 0 ? (
                successStories.map((story, index) => (
                    <div className="card" key={index}>
                        <h4>{story.title}</h4>
                        <p>{story.story}</p>
                        {story.imageUrl && <img src={story.imageUrl} alt="Success Story" />}
                    </div>
                ))
            ) : (
                <p>No success stories available. Add the first one!</p>
            )}
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title of the Success Story"
            />
            <textarea
                value={newSuccessStory}
                onChange={(e) => setNewSuccessStory(e.target.value)}
                placeholder="Add a new success story"
            />
            <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
            />
            <button onClick={handleAddSuccessStory}>Add Success Story</button>
        </div>
    );

    const renderAchievements = () => (
        <div>
            <h3>Achievements</h3>
            {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                    <div className="card" key={index}>
                        <h4>{achievement.title}</h4> {/* Display title */}
                        <p>{achievement.description}</p> {/* Display description */}
                        {achievement.imageUrl && <img src={achievement.imageUrl} alt="Achievement" />} {/* Display image */}
                    </div>
                ))
            ) : (
                <p>No achievements available. Add the first one!</p>
            )}
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} // Title input
                placeholder="Title of the Achievement" // Update placeholder for clarity
            />
            <textarea
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)} // Description input
                placeholder="Add a new achievement description"
            />
            <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])} // Image input
            />
            <button onClick={handleAddAchievement}>Add Achievement</button>
        </div>
    );

    const renderSocialLinks = () => (
        <div className="card">
            <h3>Social Links</h3>
            <ul>
                {socialLinks.linkedin && (
                    <li>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </li>
                )}
                {socialLinks.github && (
                    <li>
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </li>
                )}
                {socialLinks.leetcode && (
                    <li>
                        <a href={socialLinks.leetcode} target="_blank" rel="noopener noreferrer">LeetCode</a>
                    </li>
                )}
            </ul>
            <h4>Add/Update Social Links:</h4>
            <input
                type="text"
                value={newLinkedIn}
                onChange={(e) => setNewLinkedIn(e.target.value)}
                placeholder="LinkedIn URL"
            />
            <input
                type="text"
                value={newGithub}
                onChange={(e) => setNewGithub(e.target.value)}
                placeholder="GitHub URL"
            />
            <input
                type="text"
                value={newLeetcode}
                onChange={(e) => setNewLeetcode(e.target.value)}
                placeholder="LeetCode URL"
            />
            <button onClick={handleAddSocialLinks}>Save Social Links</button>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="header-image">
                <img src="/images/new1.avif" alt="Header" />
            </div>

            <div className="profile-content">
                <div className="profile-left">
                    <div className="personal-info">
                        <h2>Personal Information</h2>
                        {loadingProfile ? (
                            <p>Loading profile...</p>
                        ) : (
                            <>
                                {profile ? (
                                    <>
                                        {profile.photo && (
                                            <img src={profile.photo} alt={`${profile.name}'s Profile`} className="profile-picture" />
                                        )}
                                        <p><strong>Name:</strong> {profile.name}</p>
                                        <p><strong>Batch:</strong> {profile.batch}</p>
                                        <p><strong>Registration Number:</strong> {profile.rollNo}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Department:</strong> {profile.department}</p>
                                        <p><strong>Specialization:</strong> {profile.specialization}</p>
                                        <p><strong>Location:</strong> {profile.location}</p>
                                        <p><strong>Industry:</strong> {profile.industry}</p>
                                    </>
                                ) : <p>No profile data available.</p>}
                            </>
                        )}
                    </div>
                </div>

                <div className="profile-right">
                    <div className="nav">
                        <button className={activeTab === "successStories" ? "active" : ""} onClick={() => setActiveTab("successStories")}>Success Stories</button>
                        <button className={activeTab === "achievements" ? "active" : ""} onClick={() => setActiveTab("achievements")}>Achievements</button>
                        <button className={activeTab === "socialLinks" ? "active" : ""} onClick={() => setActiveTab("socialLinks")}>Social Media</button>
                    </div>
                    <div className="content">
                        {renderContent()} {/* Render content based on active tab */}
                    </div>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Profile;
