import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInformation = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        linkedIn: '',
        github: '',
        leetcode: '',
        achievements: '',
        successStory: '',
    });
    const [pictures, setPictures] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setPictures(e.target.files);
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
            formDataObj.append(key, formData[key]);
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
            {error && <p>{error}</p>}
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
                    <textarea
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Success Story:</label>
                    <textarea
                        name="successStory"
                        value={formData.successStory}
                        onChange={handleChange}
                    ></textarea>
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
