const jobService = require('../services/jobService.js'); // Replacing import with require

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new job
const createJob = async (req, res) => {
    const { title, description, email, jobType, location, subLocation } = req.body;

    // Validate required fields
    if (!title || !description || !email || !jobType || !location) {
        return res.status(400).json({ message: 'Title, description, email, job type, and location are required' });
    }

    // If location is "On-site", subLocation is required
    if (location === 'On-site' && !subLocation) {
        return res.status(400).json({ message: 'Sub-location is required for On-site jobs' });
    }

    try {
        const newJob = await jobService.createJob({ title, description, email, jobType, location, subLocation });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing job
const updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description, jobType, location, subLocation } = req.body;

    // Validate required fields
    if (!title || !description || !jobType || !location) {
        return res.status(400).json({ message: 'Title, description, job type, and location are required' });
    }

    // If location is "On-site", subLocation is required
    if (location === 'On-site' && !subLocation) {
        return res.status(400).json({ message: 'Sub-location is required for On-site jobs' });
    }

    try {
        const updatedJob = await jobService.updateJobById(id, { title, description, jobType, location, subLocation });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: 'Error updating job', error: error.message });
    }
};

// Delete a job
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
