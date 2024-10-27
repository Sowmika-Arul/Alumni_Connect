import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JobApplication.css';

const JobApplication = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobEmail, setJobEmail] = useState(''); // State for job poster's email
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null); // Fetch user ID from localStorage
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  
  // Fetch jobs on component mount
  useEffect(() => {
    axios.get('http://localhost:5050/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const handlePostJob = () => {
    if (!jobTitle || !jobDescription || !jobEmail) {
      alert('Please fill out the job title, description, and email');
      return;
    }

    const newJobData = { title: jobTitle, description: jobDescription, email: jobEmail };

    if (editingJob) {
      // Update existing job
      axios.put(`http://localhost:5050/api/jobs/${editingJob._id}`, newJobData)
        .then(response => {
          const updatedJobs = jobs.map(job => job._id === response.data._id ? response.data : job);
          setJobs(updatedJobs);
          resetForm();
          setSuccessMessage('Job updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error updating job:', error));
    } else {
      // Post new job
      axios.post('http://localhost:5050/api/jobs', newJobData)
        .then(response => {
          setJobs([...jobs, response.data]);
          resetForm();
          setSuccessMessage('Job posted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error posting job:', error));
    }
  };

  const handleApply = (job) => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    if (job.email) {
      const mailtoLink = `mailto:${job.email}?subject=Job Application for ${job.title}&body=Hello, I would like to apply for the ${job.title} position.`;
      window.location.href = mailtoLink;
      setSuccessMessage('Redirecting to email...');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('Unable to apply as the job poster email is not available.');
    }
  };

  const resetForm = () => {
    setJobTitle('');
    setJobDescription('');
    setJobEmail('');
    setEditingJob(null);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="job-application-page">
       <div className="job-search">
        <h2>Search Jobs</h2>
        <input
          type="text"
          placeholder="Search by job title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="job-post-form">
        <h2>{editingJob ? 'Edit Job' : 'Post a New Job'}</h2>
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <textarea
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email Address"
          value={jobEmail}
          onChange={(e) => setJobEmail(e.target.value)}
        />
        <button onClick={handlePostJob}>
          {editingJob ? 'Update Job' : 'Post Job'}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
     
      <div className="job-list">
        <h2>Available Jobs</h2>
        {filteredJobs.length > 0 ? (
          <ul>
            {filteredJobs.map(job => (
              <li key={job._id}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <button onClick={() => handleApply(job)}>Apply</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default JobApplication;
