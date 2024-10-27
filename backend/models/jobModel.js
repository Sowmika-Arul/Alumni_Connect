const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true }
}, { collection: 'Jobs' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
