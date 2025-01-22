import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import Navbar from './Navbar.jsx';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [successStories, setSuccessStories] = useState([]);
    const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '', leetcode: '', resume: '',portfolio:''});
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
    const [newResume, setNewResume] = useState('');
    const [newPortfolio, setNewPortfolio] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    department: profile?.department || '',
    specialization: profile?.specialization || '',
    location: profile?.location || '',
    industry: profile?.industry || '',
    batch: profile?.batch || ''
});
  

    useEffect(() => {
        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            console.error('Roll number not found in local storage');
            return;
        }
        const fetchProfileData = async () => {
            try {
                const profileResponse = await fetch(`https://alumni-connect-5ad6.onrender.com/api/profile/${rollNo}`);
                if (!profileResponse.ok) throw new Error(`Error ${profileResponse.status}: ${profileResponse.statusText}`);
                const profileData = await profileResponse.json();
                setProfile(profileData.profile);
                setLoadingProfile(false);
        
                const infoResponse = await fetch(`https://alumni-connect-5ad6.onrender.com/api/details/${rollNo}`);
                if (!infoResponse.ok) throw new Error(`Error ${infoResponse.status}: ${infoResponse.statusText}`);
                const infoData = await infoResponse.json();
                setAchievements(infoData.profile.achievements || []);
                setSuccessStories(infoData.profile.successStories || []);

        // Access social links from the social_media_links array
        const socialMediaLinks = infoData.profile?.social_media_links[0] || {};
        console.log('Social Media Links:', socialMediaLinks); 

        setSocialLinks({
            linkedin: socialMediaLinks.linkedin || '',
            github: socialMediaLinks.github || '',
            leetcode: socialMediaLinks.leetcode || '',
            resume: socialMediaLinks.resume || '',
            portfolio: socialMediaLinks.portfolio || '',
        });
                setLoadingData(false);

                // Update editedProfile state after profile data is fetched
            setEditedProfile({
                name: profileData.profile?.name || '',
                email: profileData.profile?.email || '',
                department: profileData.profile?.department || '',
                specialization: profileData.profile?.specialization || '',
                location: profileData.profile?.location || '',
                industry: profileData.profile?.industry || '',
                batch: profileData.profile?.batch || '',
            });
            
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch profile data. Please try again later.');
            }
        };        

        fetchProfileData();
    }, []);

    const handleSaveProfile = async () => {
        const rollNo = localStorage.getItem('rollNo');
        try {
            const response = await fetch(`https://alumni-connect-5ad6.onrender.com/api/edit_profile/${rollNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProfile),
            });
    
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const updatedProfile = await response.json();
            setProfile(updatedProfile.profile); // Update profile state with new data
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save changes. Please try again.');
        }
    };
    

    const renderProfileInfo = () => {
        if (isEditing) {
            return (
                <div>
                    <h3>Edit Profile</h3>
                    <input
                        type="text"
                        value={editedProfile.name}
                      disabled
                        placeholder="Name"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        placeholder="Email"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.department}
                        disabled
                        placeholder="Department"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.specialization}
                        onChange={(e) => setEditedProfile({ ...editedProfile, specialization: e.target.value })}
                        placeholder="Specialization"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        placeholder="Location"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.industry}
                        onChange={(e) => setEditedProfile({ ...editedProfile, industry: e.target.value })}
                        placeholder="Industry"
                        style={{width:'310px'}}
                    />
                    <input
                        type="text"
                        value={editedProfile.batch}
                      disabled
                        placeholder="Batch"
                        style={{width:'310px'}}
                    />
                    <button onClick={handleSaveProfile}>Save Changes</button>
                    <button onClick={() => setIsEditing(false)} style={{ marginLeft: '25px'}}>Cancel</button>
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Personal Information</h2>
                    {loadingProfile ? (
                        <p>Loading profile...
                            The verification process is going on updated soon.
                        </p>
                    ) : (
                        <>
                            {profile ? (
                                <>
                                    {profile.photo && (
                                        <img src={profile.photo} alt={`${profile.name}'s Profile`} className="profile-picture" />
                                    )}
                                    <p><strong>Name:</strong> {profile.name}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                    <p><strong>Batch:</strong> {profile.batch}</p>
                                    <p><strong>Department:</strong> {profile.department}</p>
                                    <p><strong>Specialization:</strong> {profile.specialization}</p>
                                    <p><strong>Location:</strong> {profile.location}</p>
                                    <p><strong>Industry:</strong> {profile.industry}</p>
                                </>
                            ) : <p>No profile data available.</p>}
                            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    )}
                </div>
            );
        }
    };
    
    // Function to handle adding achievements
    const handleAddAchievement = async () => {
        const rollNo = localStorage.getItem('rollNo');
        try {
            const formData = new FormData();
            formData.append('title', newTitle); // Include title
            formData.append('description', newAchievement); // Description
            if (newImage) formData.append('image', newImage); // Include image if exists
            formData.append('date', new Date().toISOString()); // Set the date to now

            const response = await fetch(`https://alumni-connect-5ad6.onrender.com/api/add_achievement/${rollNo}`, {
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

            const response = await fetch(`https://alumni-connect-5ad6.onrender.com/api/add_success_story/${rollNo}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const updatedData = await response.json();
            console.log('Achievements updated:', updatedData.achievements);
console.log('Success stories updated:', updatedData.successStories);
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
                portfolio: newPortfolio || socialLinks.portfolio,
                resume: newResume || socialLinks.resume
            };

            const response = await fetch(`https://alumni-connect-5ad6.onrender.com/api/add_social_links/${rollNo}`, {
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
        setNewLeetcode('');
        setNewPortfolio('');
        setNewResume(''); // Reset LeetCode URL
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
                        <div className="card-content">
                            <div className="text-content">
                                <h4>{story.title}</h4>
                                <p>{story.story}</p>
                            </div>
                            {story.imageUrl && (
                                <div className="image-content">
                                    <img src={`https://alumni-connect-5ad6.onrender.com/${story.imageUrl}`} alt="Success Story" />
                                </div>
                            )}
                        </div>
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
                        <div className="card-content">
                            <div className="text-content">
                                <h4>{achievement.title}</h4>
                                <p>{achievement.description}</p>
                            </div>
                            {achievement.imageUrl && (
                                <div className="image-content">
                                    <img src={`https://alumni-connect-5ad6.onrender.com/${achievement.imageUrl}`} alt="Achievement" />
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No achievements available. Add the first one!</p>
            )}
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title of the Achievement"
            />
            <textarea
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add a new achievement description"
            />
            <input
            style = {
                {width : "98%"}
            }
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
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
                {socialLinks.portfolio && (
                    <li>
                        <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>
                    </li>
                )}
                {socialLinks.resume && (
                    <li>
                        <a href={socialLinks.resume} target="_blank" rel="noopener noreferrer">Resume</a>
                    </li>
                )}
            </ul>
            <h4>Add/Update Social Links:</h4>
        <input
            type="text"
            style = {
                {width : "95%"}
            }
            value={socialLinks.linkedin} 
            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            placeholder="LinkedIn URL"
        />
        <input
            type="text"
            style = {
                {width : "95%"}
            }
            value={socialLinks.github} 
            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
            placeholder="GitHub URL"
        />
        <input
            type="text"
            style = {
                {width : "95%"}
            }
            value={socialLinks.leetcode} // Populate with existing value
            onChange={(e) => setSocialLinks({ ...socialLinks, leetcode: e.target.value })}
            placeholder="LeetCode URL"
        />
        <input
            style = {
                {width : "95%"}
            }
            type="text"
            value={socialLinks.portfolio} // Populate with existing value
            onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })} 
            placeholder="Portfolio URL"
        />
         <input
            type="text"
            style = {
                {width : "95%"}
            }
            value={socialLinks.resume} 
            onChange={(e) => setSocialLinks({ ...socialLinks, resume: e.target.value })}
            placeholder="Resume URL"
        />
            <button
            style = {
                {width : "97%"}
            }
             onClick={handleAddSocialLinks}>Save Social Links</button>
        </div>
    );

    return (
        <div className="profile-container">
            <Navbar/>
            <div className="header-image">
                <img src="/images/deepai1.jpg" alt="Header" />
            </div>

            <div className="profile-content">
                <div className="profile-left">
                {renderProfileInfo()}
                    </div>

                <div className="profile-right">
                    <div className="nav">
                        <button className={activeTab === "successStories" ? "active" : ""} onClick={() => setActiveTab("successStories")}>Success Stories</button>
                        <button className={activeTab === "achievements" ? "active" : ""} onClick={() => setActiveTab("achievements")}>Achievements</button>
                        <button className={activeTab === "socialLinks" ? "active" : ""} onClick={() => setActiveTab("socialLinks")}>Social Media</button>
                    </div>
                    <div className="content">
                        {renderContent()} 
                    </div>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Profile;