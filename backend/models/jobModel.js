const mongoose = require('mongoose');

// Create a custom validation function to check if subLocation is required when the location is On-site
const subLocationValidator = function() {
  // If the location is "On-site", subLocation must be provided.
  if (this.location === 'On-site' && !this.subLocation) {
    return false;
  }
  return true;
};

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  jobType: { 
    type: String, 
    required: true, 
    enum: ['Full-time', 'Part-time', 'Freelance'],  // Restrict job types to predefined values
  },
  location: { 
    type: String, 
    required: true, 
    enum: ['Remote', 'On-site'],  // Restrict locations to predefined values
  },
  subLocation: { 
    type: String, 
    enum: ['Chennai', 'Coimbatore', 'Bangalore', 'Hyderabad', 'Trichy'],  // Allow specific sub-locations for On-site jobs
    validate: [subLocationValidator, 'Sub-location is required for On-site jobs'], // Custom validator
  }
}, { collection: 'Jobs' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
