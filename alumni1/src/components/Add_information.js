import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Add_information.css'; 

const AddInformation = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        linkedIn: '',
        github: '',
        leetcode: '',
        achievements: [],
        successStory: [],
    });
    const [pictures, setPictures] = useState([]);
    const [error, setError] = useState('');
    const [newAchievement, setNewAchievement] = useState('');
    const [newStory, setNewStory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rollNo from localStorage
        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            navigate('/login'); // Redirect to login if rollNo is not available
            return;
        }

        const fetchInformation = async () => {
            try {
                const response = await fetch(`http://localhost:5050/get_information/${rollNo}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        phoneNumber: data.phoneNumber || '',
                        linkedIn: data.linkedIn || '',
                        github: data.github || '',
                        leetcode: data.leetcode || '',
                        achievements: data.achievements || [],
                        successStory: data.successStory || [],
                    });
                } else {
                    setError('Failed to fetch information');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchInformation();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setPictures(e.target.files);
    };

    const handleAddAchievement = () => {
        setFormData((prevData) => ({
            ...prevData,
            achievements: [...prevData.achievements, newAchievement],
        }));
        setNewAchievement('');
    };

    const handleAddStory = () => {
        setFormData((prevData) => ({
            ...prevData,
            successStory: [...prevData.successStory, newStory],
        }));
        setNewStory('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get rollNo from localStorage
        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            setError('User is not logged in');
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('rollNo', rollNo); // Include rollNo in the form data

        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => formDataObj.append(key, item));
            } else {
                formDataObj.append(key, formData[key]);
            }
        }

        for (let i = 0; i < pictures.length; i++) {
            formDataObj.append('pictures', pictures[i]);
        }

        try {
            const response = await fetch('http://localhost:5050/add_information', {
                method: 'POST',
                body: formDataObj
            });

            if (response.ok) {
                navigate('/profile'); // Redirect to profile after successful submission
            } else {
                setError('Failed to submit information');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div>
            <h2>Add Information</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>LinkedIn:</label>
                    <input
                        type="url"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>GitHub:</label>
                    <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>LeetCode:</label>
                    <input
                        type="url"
                        name="leetcode"
                        value={formData.leetcode}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Achievements:</label>
                    <ul>
                        {formData.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                    />
                    <button type="button" onClick={handleAddAchievement}>
                        Add Achievement
                    </button>
                </div>
                <div>
                    <label>Success Stories:</label>
                    <ul>
                        {formData.successStory.map((story, index) => (
                            <li key={index}>{story}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newStory}
                        onChange={(e) => setNewStory(e.target.value)}
                    />
                    <button type="button" onClick={handleAddStory}>
                        Add Story
                    </button>
                </div>
                <div>
                    <label>Upload Pictures:</label>
                    <input
                        type="file"
                        name="pictures"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddInformation;
