const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: String,
    domain: String,
    description: String,
    imageUrl: String,
    percentageCompleted: Number,
    endUser: String,
    teamLeaderName: String,
    emailId: String,
    department: String,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
