// AddInformation.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 100vh;
    background-color: #000000;
    color: #F4F4F4;
    padding: 20px;
    box-sizing: border-box;
`;

const Title = styled.h2`
    color: #FFC107;
    font-size: 28px;
    margin-bottom: 20px;
`;

const Form = styled.form`
    width: 100%;
    max-width: 800px;
    background-color: #1A1A1A;
    border: 2px solid #FFC107;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
    color: #FFC107;
`;

const Input = styled.input`
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #3A3A3A;
    color: #fffcfc;
    font-size: 14px;
    margin-bottom: 15px;
    box-sizing: border-box;

    &[type='file'] {
        border: none;
        padding: 5px;
    }
`;

const TextArea = styled.textarea`
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #3A3A3A;
    color: #fffcfc;
    font-size: 14px;
    margin-bottom: 15px;
    box-sizing: border-box;
    resize: vertical;
    min-height: 100px;
`;

const Button = styled.button`
    background-color: ${({ variant }) => (variant === 'add' ? '#28A745' : '#FFC107')};
    color: #1A1A1A;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-top: 10px;
    box-sizing: border-box;

    &:hover {
        background-color: ${({ variant }) => (variant === 'add' ? '#218838' : '#FFA500')};
        color: #000000;
    }

    &:not(:last-child) {
        margin-right: 10px;
    }
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
`;

const ListItem = styled.li`
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2C2C2C;
    padding: 8px 10px;
    border-radius: 5px;
`;

const ErrorMessage = styled.p`
    color: #FF0000;
    margin-bottom: 15px;
    text-align: center;
`;

const AddInformation = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        linkedIn: '',
        github: '',
        leetcode: '',
        achievements: [],
        successStories: [],
    });
    const [pictures, setPictures] = useState([]);
    const [error, setError] = useState('');
    const [newAchievement, setNewAchievement] = useState('');
    const [newStory, setNewStory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            navigate('/login');
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
                        successStories: data.successStories || [],
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
        if (newAchievement.trim() !== '') {
            setFormData((prevData) => ({
                ...prevData,
                achievements: [...prevData.achievements, newAchievement.trim()],
            }));
            setNewAchievement('');
        }
    };

    const handleAddStory = () => {
        if (newStory.trim() !== '') {
            setFormData((prevData) => ({
                ...prevData,
                successStories: [...prevData.successStories, newStory.trim()],
            }));
            setNewStory('');
        }
    };

    const handleRemoveAchievement = (index) => {
        setFormData((prevData) => {
            const newAchievements = [...prevData.achievements];
            newAchievements.splice(index, 1);
            return { ...prevData, achievements: newAchievements };
        });
    };

    const handleRemoveStory = (index) => {
        setFormData((prevData) => {
            const newStories = [...prevData.successStories];
            newStories.splice(index, 1);
            return { ...prevData, successStories: newStories };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const rollNo = localStorage.getItem('rollNo');
        if (!rollNo) {
            setError('User is not logged in');
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('rollNo', rollNo);
        formDataObj.append('phoneNumber', formData.phoneNumber);
        formDataObj.append('linkedIn', formData.linkedIn);
        formDataObj.append('github', formData.github);
        formDataObj.append('leetcode', formData.leetcode);
        formData.achievements.forEach((achievement) => formDataObj.append('achievements', achievement));
        formData.successStories.forEach((story) => formDataObj.append('successStories', story));
        for (let i = 0; i < pictures.length; i++) {
            formDataObj.append('pictures', pictures[i]);
        }

        try {
            const response = await fetch('http://localhost:5050/add_information', {
                method: 'POST',
                body: formDataObj,
            });

            if (response.ok) {
                navigate('/profile');
            } else {
                setError('Failed to submit information');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <Container>
            <Title>Add Information</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <FormGroup>
                    <Label>Phone Number:</Label>
                    <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>LinkedIn:</Label>
                    <Input
                        type="url"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        placeholder="Enter your LinkedIn profile URL"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>GitHub:</Label>
                    <Input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="Enter your GitHub profile URL"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>LeetCode:</Label>
                    <Input
                        type="url"
                        name="leetcode"
                        value={formData.leetcode}
                        onChange={handleChange}
                        placeholder="Enter your LeetCode profile URL"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Achievements:</Label>
                    <List>
                        {formData.achievements.map((achievement, index) => (
                            <ListItem key={index}>
                                {achievement}
                                <Button
                                    type="button"
                                    variant="add"
                                    onClick={() => handleRemoveAchievement(index)}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Input
                        type="text"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder="Enter a new achievement"
                    />
                    <Button type="button" variant="add" onClick={handleAddAchievement}>
                        Add Achievement
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Label>Success Stories:</Label>
                    <List>
                        {formData.successStories.map((story, index) => (
                            <ListItem key={index}>
                                {story}
                                <Button
                                    type="button"
                                    variant="add"
                                    onClick={() => handleRemoveStory(index)}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <TextArea
                        value={newStory}
                        onChange={(e) => setNewStory(e.target.value)}
                        placeholder="Share a success story"
                    />
                    <Button type="button" variant="add" onClick={handleAddStory}>
                        Add Story
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Label>Upload Pictures:</Label>
                    <Input
                        type="file"
                        name="pictures"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                </FormGroup>
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default AddInformation;
