// src/services/jobService.js
const Job = require('../models/jobModel'); // Ensure this path points to your Job model

const getAllJobs = async () => {
    return await Job.find();
};

const createJob = async (jobData) => {
    const job = new Job(jobData);
    return await job.save();
};

const updateJobById = async (id, updateData) => {
    return await Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteJobById = async (id) => {
    return await Job.findByIdAndDelete(id);
};

module.exports = {
    getAllJobs,
    createJob,
    updateJobById,
    deleteJobById,
};
