import React, { useState } from 'react';
import '../styles/ProjectUpload.css';

function ProjectUpload() {
    const [projectName, setProjectName] = useState('');
    const [domain, setDomain] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [percentageCompleted, setPercentageCompleted] = useState('');
    const [endUser, setEndUser] = useState('');
    const [teamLeaderName, setTeamLeaderName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [department, setDepartment] = useState('');
    const [message, setMessage] = useState('');

    const handleProjectNameChange = (e) => setProjectName(e.target.value);
    const handleDomainChange = (e) => setDomain(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleImageChange = (e) => setImage(e.target.files[0]);
    const handlePercentageChange = (e) => setPercentageCompleted(e.target.value);
    const handleEndUserChange = (e) => setEndUser(e.target.value);
    const handleTeamLeaderNameChange = (e) => setTeamLeaderName(e.target.value);
    const handleEmailIdChange = (e) => setEmailId(e.target.value);
    const handleDepartmentChange = (e) => setDepartment(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !domain || !description || !image || !percentageCompleted || !endUser || !teamLeaderName || !emailId || !department) {
            setMessage('Please fill in all fields and select an image.');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('domain', domain);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('percentageCompleted', percentageCompleted);
        formData.append('endUser', endUser);
        formData.append('teamLeaderName', teamLeaderName);
        formData.append('emailId', emailId);
        formData.append('department', department);

        try {
            // Make a POST request to the server to upload the project
            const response = await fetch('http://localhost:5050/api/upload_project', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('Project uploaded successfully!');
                // Reset form fields
                setProjectName('');
                setDomain('');
                setDescription('');
                setImage(null);
                setPercentageCompleted('');
                setEndUser('');
                setTeamLeaderName('');
                setEmailId('');
                setDepartment('');
            } else {
                setMessage('Failed to upload project. Please try again.');
            }
        } catch (err) {
            setMessage('An error occurred while uploading the project.');
        }
    };

    return (
        <div className="project-upload-container">
            <h2>Innovative Projects</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="project-upload-form">
                <label htmlFor="projectName">Project Name:</label>
                <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={handleProjectNameChange}
                />

                <label htmlFor="domain">Domain of the Project:</label>
                <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={handleDomainChange}
                />

                <label htmlFor="description">Project Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                ></textarea>

                <label htmlFor="image">Project Image:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <label htmlFor="percentageCompleted">Percentage Completed:</label>
                <input
                    type="number"
                    id="percentageCompleted"
                    value={percentageCompleted}
                    onChange={handlePercentageChange}
                    min="0"
                    max="100"
                />

                <label htmlFor="endUser">End User of the Product:</label>
                <input
                    type="text"
                    id="endUser"
                    value={endUser}
                    onChange={handleEndUserChange}
                />

                {/* New Student Details Fields */}
                <label htmlFor="teamLeaderName">Team Leader Name:</label>
                <input
                    type="text"
                    id="teamLeaderName"
                    value={teamLeaderName}
                    onChange={handleTeamLeaderNameChange}
                />

                <label htmlFor="emailId">Email ID:</label>
                <input
                    type="email"
                    id="emailId"
                    value={emailId}
                    onChange={handleEmailIdChange}
                />

                <label htmlFor="department">Department:</label>
                <input
                    type="text"
                    id="department"
                    value={department}
                    onChange={handleDepartmentChange}
                />

                <button type="submit">Upload Project</button>
            </form>
        </div>
    );
}

export default ProjectUpload;
