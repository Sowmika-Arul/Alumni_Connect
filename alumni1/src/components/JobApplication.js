// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import './JobApplication.css';

// // const JobApplication = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [jobTitle, setJobTitle] = useState('');
// //   const [jobDescription, setJobDescription] = useState('');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   useEffect(() => {
// //     // Fetch jobs from the server
// //     axios.get('http://localhost:5050/api/jobs')
// //       .then(response => setJobs(response.data))
// //       .catch(error => console.error('Error fetching jobs:', error));
// //   }, []);

// //   const handlePostJob = () => {
// //     if (!jobTitle || !jobDescription) {
// //       alert('Please fill out both the job title and description');
// //       return;
// //     }

// //     // Post a new job
// //     axios.post('http://localhost:5050/api/jobs', { title: jobTitle, description: jobDescription })
// //       .then(response => {
// //         setJobs([...jobs, response.data]);
// //         setJobTitle('');
// //         setJobDescription('');
// //         setSuccessMessage('Job posted successfully!');
// //         setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
// //       })
// //       .catch(error => console.error('Error posting job:', error));
// //   };

// //   const filteredJobs = jobs.filter(job =>
// //     job.title.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div className="job-application-page">
// //       <div className="job-post-form">
// //         <h2>Post a New Job</h2>
// //         <input
// //           type="text"
// //           placeholder="Job Title"
// //           value={jobTitle}
// //           onChange={(e) => setJobTitle(e.target.value)}
// //         />
// //         <textarea
// //           placeholder="Job Description"
// //           value={jobDescription}
// //           onChange={(e) => setJobDescription(e.target.value)}
// //         />
// //         <button onClick={handlePostJob}>Post Job</button>
// //         {successMessage && <p className="success-message">{successMessage}</p>}
// //       </div>
// //       <div className="job-search">
// //         <h2>Search Jobs</h2>
// //         <input
// //           type="text"
// //           placeholder="Search by job title"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //         />
// //       </div>
// //       <div className="job-list">
// //         <h2>Available Jobs</h2>
// //         {filteredJobs.length > 0 ? (
// //           <ul>
// //             {filteredJobs.map(job => (
// //               <li key={job._id}>
// //                 <h3>{job.title}</h3>
// //                 <p>{job.description}</p>
// //                 <button>Apply</button>
// //               </li>
// //             ))}
// //           </ul>
// //         ) : (
// //           <p>No jobs available</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default JobApplication;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './JobApplication.css';

// const JobApplication = () => {
//   const [jobs, setJobs] = useState([]);
//   const [jobTitle, setJobTitle] = useState('');
//   const [jobDescription, setJobDescription] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [userId, setUserId] = useState(null); // State to hold user ID
//   const [editingJob, setEditingJob] = useState(null); // State to hold job being edited

//   useEffect(() => {
//     axios.get('http://localhost:5050/api/jobs')
//       .then(response => setJobs(response.data))
//       .catch(error => console.error('Error fetching jobs:', error));
      
//     axios.get('http://localhost:5050/api/user/profile')
//       .then(response => setUserId(response.data.userId)) // Ensure this matches your backend response structure
//       .catch(error => console.error('Error fetching user profile:', error));
//   }, []);

//   const handlePostJob = () => {
//     if (!jobTitle || !jobDescription) {
//       alert('Please fill out both the job title and description');
//       return;
//     }

//     if (editingJob) {
//       axios.put(`http://localhost:5050/api/jobs/${editingJob._id}`, { title: jobTitle, description: jobDescription })
//         .then(response => {
//           const updatedJobs = jobs.map(job => job._id === response.data._id ? response.data : job);
//           setJobs(updatedJobs);
//           setJobTitle('');
//           setJobDescription('');
//           setEditingJob(null);
//           setSuccessMessage('Job updated successfully!');
//           setTimeout(() => setSuccessMessage(''), 3000);
//         })
//         .catch(error => console.error('Error updating job:', error));
//     } else {
//       axios.post('http://localhost:5050/api/jobs', { title: jobTitle, description: jobDescription })
//         .then(response => {
//           setJobs([...jobs, response.data]);
//           setJobTitle('');
//           setJobDescription('');
//           setSuccessMessage('Job posted successfully!');
//           setTimeout(() => setSuccessMessage(''), 3000);
//         })
//         .catch(error => console.error('Error posting job:', error));
//     }
//   };

//   // const handleApply = (jobId) => {
//   //   if (!userId) {
//   //     alert('User not logged in');
//   //     console.log('User ID:', userId); // Debugging line
//   //     return;
//   //   }

//   //   axios.post(`http://localhost:5050/api/jobs/${jobId}/apply`, { applicantId: userId })
//   //     .then(response => {
//   //       setSuccessMessage('Successfully applied for the job!');
//   //       setTimeout(() => setSuccessMessage(''), 3000);
//   //     })
//   //     .catch(error => {
//   //       console.error('Error applying for job:', error);
//   //       alert('Failed to apply for the job. Please try again later.');
//   //     });
//   // };
//   const handleApply = (jobId) => {
//     if (!userId) {
//         alert('User not logged in');
//         return;
//     }

//     // Apply for the job
//     axios.post(`http://localhost:5050/api/jobs/${jobId}/apply`, { applicantId: userId })
//         .then(response => {
//             setSuccessMessage('Successfully applied for the job!');
//             setTimeout(() => setSuccessMessage(''), 3000);
//         })
//         .catch(error => {
//             console.error('Error applying for job:', error);
//             alert('Failed to apply for the job. Please try again later.');
//         });
// };

//   const handleEdit = (job) => {
//     setJobTitle(job.title);
//     setJobDescription(job.description);
//     setEditingJob(job);
//   };

//   const handleDelete = (jobId) => {
//     axios.delete(`http://localhost:5050/api/jobs/${jobId}`)
//       .then(() => {
//         setJobs(jobs.filter(job => job._id !== jobId));
//         setSuccessMessage('Job deleted successfully!');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       })
//       .catch(error => {
//         console.error('Error deleting job:', error);
//         alert('Failed to delete the job. Please try again later.');
//       });
//   };

//   const filteredJobs = jobs.filter(job =>
//     job.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="job-application-page">
//       <div className="job-post-form">
//         <h2>{editingJob ? 'Edit Job' : 'Post a New Job'}</h2>
//         <input
//           type="text"
//           placeholder="Job Title"
//           value={jobTitle}
//           onChange={(e) => setJobTitle(e.target.value)}
//         />
//         <textarea
//           placeholder="Job Description"
//           value={jobDescription}
//           onChange={(e) => setJobDescription(e.target.value)}
//         />
//         <button onClick={handlePostJob}>
//           {editingJob ? 'Update Job' : 'Post Job'}
//         </button>
//         {successMessage && <p className="success-message">{successMessage}</p>}
//       </div>
//       <div className="job-search">
//         <h2>Search Jobs</h2>
//         <input
//           type="text"
//           placeholder="Search by job title"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <div className="job-list">
//         <h2>Available Jobs</h2>
//         {filteredJobs.length > 0 ? (
//           <ul>
//             {filteredJobs.map(job => (
//               <li key={job._id}>
//                 <h3>{job.title}</h3>
//                 <p>{job.description}</p>
//                 <button onClick={() => handleApply(job._id)}>Apply</button>
//                 <button onClick={() => handleEdit(job)}>Edit</button>
//                 <button onClick={() => handleDelete(job._id)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No jobs available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobApplication;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobApplication.css';

const JobApplication = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null); // State to hold user ID
  const [editingJob, setEditingJob] = useState(null); // State to hold job being edited

  useEffect(() => {
    // Fetch user profile to get userId
    axios.get('http://localhost:5050/api/user/profile')
      .then(response => {
        console.log('Profile Response:', response.data); // Log response to ensure correctness
        setUserId(response.data.userId);
        console.log('User ID after setting:', response.data.userId); // Debugging line to confirm it's set
      })
      .catch(error => console.error('Error fetching user profile:', error));
  }, []);
  

  // Fetch jobs and user profile on component mount
  useEffect(() => {
    // Fetch available jobs
    axios.get('http://localhost:5050/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
      
    // Fetch user profile to get userId
    axios.get('http://localhost:5050/api/user/profile')
      .then(response => {
        console.log('Profile Response:', response.data); // Log response to ensure correctness
        setUserId(response.data.userId);
      })
      .catch(error => console.error('Error fetching user profile:', error));
  }, []);

  // Handle posting or updating a job
  const handlePostJob = () => {
    if (!jobTitle || !jobDescription) {
      alert('Please fill out both the job title and description');
      return;
    }

    if (editingJob) {
      // Update existing job
      axios.put(`http://localhost:5050/api/jobs/${editingJob._id}`, { title: jobTitle, description: jobDescription })
        .then(response => {
          const updatedJobs = jobs.map(job => job._id === response.data._id ? response.data : job);
          setJobs(updatedJobs);
          setJobTitle('');
          setJobDescription('');
          setEditingJob(null);
          setSuccessMessage('Job updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error updating job:', error));
    } else {
      // Post new job
      axios.post('http://localhost:5050/api/jobs', { title: jobTitle, description: jobDescription })
        .then(response => {
          setJobs([...jobs, response.data]);
          setJobTitle('');
          setJobDescription('');
          setSuccessMessage('Job posted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error posting job:', error));
    }
  };

  // Handle applying for a job
  const handleApply = (jobId) => {
    if (!userId) {
        alert('User not logged in');
        console.log('User ID:', userId); // Debugging line to see if userId is being set
        return;
    }
  
    axios.post(`http://localhost:5050/api/jobs/${jobId}/apply`, { applicantId: userId })
      .then(response => {
        console.log('Application response:', response.data); // Log the response for debugging
        setSuccessMessage('Successfully applied for the job!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error applying for job:', error);
        alert('Failed to apply for the job. Please try again later.');
      });
  };
  

  // Handle editing a job
  const handleEdit = (job) => {
    setJobTitle(job.title);
    setJobDescription(job.description);
    setEditingJob(job);
  };

  // Handle deleting a job
  const handleDelete = (jobId) => {
    axios.delete(`http://localhost:5050/api/jobs/${jobId}`)
      .then(() => {
        setJobs(jobs.filter(job => job._id !== jobId));
        setSuccessMessage('Job deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error deleting job:', error);
        alert('Failed to delete the job. Please try again later.');
      });
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-application-page">
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
        <button onClick={handlePostJob}>
          {editingJob ? 'Update Job' : 'Post Job'}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      <div className="job-search">
        <h2>Search Jobs</h2>
        <input
          type="text"
          placeholder="Search by job title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="job-list">
        <h2>Available Jobs</h2>
        {filteredJobs.length > 0 ? (
          <ul>
            {filteredJobs.map(job => (
              <li key={job._id}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <button onClick={() => handleApply(job._id)}>Apply</button>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
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
