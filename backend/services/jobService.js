const Job = require('../models/jobModel.js');

const getAllJobs = async () => {
    return await Job.find();
};

const createJob = async ({ title, description, email }) => {
    const job = new Job({ title, description, email });
    return await job.save();
};

const updateJobById = async (id, update) => {
    return await Job.findByIdAndUpdate(id, update, { new: true });
};

const deleteJobById = async (id) => {
    return await Job.findByIdAndDelete(id);
};

module.exports = {
    getAllJobs,
    createJob,
    updateJobById,
    deleteJobById
};
