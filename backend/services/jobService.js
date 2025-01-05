const Job = require('../models/jobModel'); // Import Job model

// Get all jobs
const getAllJobs = async () => {
    return await Job.find();
};

// Create a new job
const createJob = async (jobData) => {
    const { title, description, email, jobType, location, subLocation } = jobData;

    // If location is 'On-site', ensure subLocation is provided
    if (location === 'On-site' && !subLocation) {
        throw new Error('Sub-location is required for On-site jobs');
    }

    const newJob = new Job({
        title,
        description,
        email,
        jobType,
        location,
        subLocation  // Store the subLocation if provided
    });

    return await newJob.save();
};

// Update a job by ID
const updateJobById = async (id, jobData) => {
    const { title, description, jobType, location, subLocation } = jobData;

    // If location is 'On-site', ensure subLocation is provided
    if (location === 'On-site' && !subLocation) {
        throw new Error('Sub-location is required for On-site jobs');
    }

    return await Job.findByIdAndUpdate(
        id,
        { title, description, jobType, location, subLocation }, // Include subLocation
        { new: true }
    );
};

// Delete a job by ID
const deleteJobById = async (id) => {
    return await Job.findByIdAndDelete(id);
};

module.exports = {
    getAllJobs,
    createJob,
    updateJobById,
    deleteJobById
};
