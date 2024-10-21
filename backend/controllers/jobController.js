// src/controllers/jobController.js
const jobService = require('../services/jobService');

const getJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createJob = async (req, res) => {
    const { title, description } = req.body;

    try {
        const newJob = await jobService.createJob({ title, description });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        const updatedJob = await jobService.updateJobById(id, { title, description });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: 'Error updating job', error: error.message });
    }
};

const deleteJob = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedJob = await jobService.deleteJobById(id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
};
