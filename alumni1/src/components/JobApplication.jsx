import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JobApplication.css';
import Navbar from './Navbar.jsx';

const JobApplication = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobEmail, setJobEmail] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    jobType: [],
    location: [],
    subLocation: []
  });
  const [userBatch, setUserBatch] = useState(''); 
  const [isAlumni, setIsAlumni] = useState(false); 
  useEffect(() => {
    const storedRollNo = localStorage.getItem('rollNo');
    const storedUserId = localStorage.getItem('userId');
    console.log(userId);
    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedRollNo) {
      // Fetch user profile based on roll number
      axios.get(`https://alumni-connect-5ad6.onrender.com/api/profile/${storedRollNo}`)
        .then(response => {
          const profile = response.data;
          console.log('Fetched profile:', profile); // Debugging line to check profile data
  
          // Access the nested profile object
          if (profile && profile.profile && profile.profile.batch) {
            setUserBatch(profile.profile.batch);
            console.log(profile.profile.batch);
            
            // Check if the user is an alumni based on the batch
            const currentYear = new Date().getFullYear();
            const batchEndYear = parseInt(profile.profile.batch.split(' - ')[1], 10);
           console.log(currentYear);
           console.log(batchEndYear);
           
            if (batchEndYear <= currentYear) {
              setIsAlumni(true);
            }
          } else {
            console.error('Batch information is missing from profile data.');
          }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, []);

  useEffect(() => {
    axios.get('https://alumni-connect-5ad6.onrender.com/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const handlePostJob = () => {
    if (!isAlumni) {
      alert('Only alumni are allowed to post jobs.');
      return;
    }

    if (!jobTitle || !jobDescription || !jobEmail || !jobType || !location) {
      alert('Please fill out the job title, description, email, job type, and location');
      return;
    }

    const newJobData = { 
      title: jobTitle, 
      description: jobDescription, 
      email: jobEmail, 
      jobType, 
      location,
      subLocation
    };

    if (editingJob) {
      axios.put(`https://alumni-connect-5ad6.onrender.com/api/jobs/${editingJob._id}`, newJobData)
        .then(response => {
          const updatedJobs = jobs.map(job => job._id === response.data._id ? response.data : job);
          setJobs(updatedJobs);
          resetForm();
          setSuccessMessage('Job updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error updating job:', error));
    } else {
      axios.post('https://alumni-connect-5ad6.onrender.com/api/jobs', newJobData)
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
    // if (!userId) {
    //   alert('User not logged in');
    //   return;
    // }

    if (job.email) {
      const mailtoLink = `mailto:${job.email}?subject=Job Application for ${job.title}&body=Hello, I would like to apply for the ${job.title} position.`;
      window.location.href = mailtoLink;
      setSuccessMessage('Redirecting to email...');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('Unable to apply as the job poster email is not available.');
    }
  };

  const handleFilterChange = (e, category) => {
    const { value, checked } = e.target;
    setFilters(prevFilters => {
      const updatedCategory = checked
        ? [...prevFilters[category], value]
        : prevFilters[category].filter(item => item !== value);

      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const resetForm = () => {
    setJobTitle('');
    setJobDescription('');
    setJobEmail('');
    setJobType('');
    setLocation('');
    setSubLocation('');
    setEditingJob(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesTitle = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = filters.jobType.length ? filters.jobType.includes(job.jobType) : true;
    const matchesLocation = filters.location.length ? filters.location.includes(job.location) : true;
    const matchesSubLocation = filters.subLocation.length ? filters.subLocation.includes(job.subLocation) : true;

    return matchesTitle && matchesJobType && matchesLocation && matchesSubLocation;
  });

  return (
    <div>
      <Navbar />
      <div className="job-application-page">
        <div className="filter-container">
          <h2>Filter Jobs</h2>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search by job title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '280px' }}
            />
          </div>

          <div className="filter-section">
            <h3>Job Type</h3>
            <label>
              <input
                type="checkbox"
                value="Full-time"
                onChange={(e) => handleFilterChange(e, 'jobType')}
              />
              Full-time
            </label>
            <label>
              <input
                type="checkbox"
                value="Part-time"
                onChange={(e) => handleFilterChange(e, 'jobType')}
              />
              Part-time
            </label>
            <label>
              <input
                type="checkbox"
                value="Freelance"
                onChange={(e) => handleFilterChange(e, 'jobType')}
              />
              Freelance
            </label>
          </div>

          <div className="filter-section">
            <h3>Location</h3>
            <label>
              <input
                type="checkbox"
                value="Remote"
                onChange={(e) => handleFilterChange(e, 'location')}
              />
              Remote
            </label>
            <label>
              <input
                type="checkbox"
                value="On-site"
                onChange={(e) => handleFilterChange(e, 'location')}
              />
              On-site
            </label>

            {filters.location.includes('On-site') && (
              <div className="sub-location-filter">
                <h3>Sub-location (For On-site)</h3>
                <label>
                  <input
                    type="checkbox"
                    value="Chennai"
                    onChange={(e) => handleFilterChange(e, 'subLocation')}
                  />
                  Chennai
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Coimbatore"
                    onChange={(e) => handleFilterChange(e, 'subLocation')}
                  />
                  Coimbatore
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Bangalore"
                    onChange={(e) => handleFilterChange(e, 'subLocation')}
                  />
                  Bangalore
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Hyderabad"
                    onChange={(e) => handleFilterChange(e, 'subLocation')}
                  />
                  Hyderabad
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Trichy"
                    onChange={(e) => handleFilterChange(e, 'subLocation')}
                  />
                  Trichy
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="job-post-container">
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
            ></textarea>
            <input
              type="email"
              placeholder="Contact Email"
              value={jobEmail}
              onChange={(e) => setJobEmail(e.target.value)}
            />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
            </select>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select Location</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
            {location === 'On-site' && (
              <select value={subLocation} onChange={(e) => setSubLocation(e.target.value)}>
                <option value="">Select Sub-location</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Trichy">Trichy</option>
              </select>
            )}
            <button onClick={handlePostJob}>{editingJob ? 'Update Job' : 'Post Job'}</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>

          <div className="job-list">
            <h2>Job Listings</h2>
            {filteredJobs.map((job) => (
              <div className="job-card" key={job._id} style={{border: '2px solid #001F3F', borderRadius: '8px',  marginBottom: '20px', /* Increased margin between job listings */
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', padding: '20px' /* Subtle shadow around each job */}}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <p>Job Type: {job.jobType}</p>
                <p>Location: {job.location} {job.subLocation && `- ${job.subLocation}`}</p>
                <div className="apply-button-container">
        <button onClick={() => handleApply(job)}>Apply</button>
      </div>
                {userId && job.userId === userId && (
                  <>
                    <button onClick={() => setEditingJob(job)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
