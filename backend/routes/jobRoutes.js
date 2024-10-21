// src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Fetch all jobs
router.get('/jobs', jobController.getJobs);

// Create a new job
router.post('/jobs', jobController.createJob);

// Update a job by ID
router.put('/jobs/:id', jobController.updateJob);

// Delete a job by ID
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;
