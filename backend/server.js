require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const jobRoutes = require('./routes/jobRoutes');
const donationRoutes = require('./routes/donationRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const socialLinksRoutes = require('./routes/socialLinksRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const updateProfileRoutes = require('./routes/Updateprofile');
const Video = require('./models/Video');
const Project = require('./models/projectModel'); 
const path = require('path');
const cloudinary = require('cloudinary').v2;


const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

// Allow requests from the frontend origin
const corsOptions = {
    origin: ['https://alumni-connect-1-deda.onrender.com', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads')); 


const dbURI = process.env.MONGODB_URI;

// PayPal configuration
paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    log: {
        level: 'info',
        filePath: 'paypal.log',
        maxSize: 10 * 1024 * 1024, // 10 MB
        maxFiles: 5
    }
});

donationRoutes.get('/success', (req, res) => {
    // Handle the request here
    res.send('Success page loaded');
});

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

app.use('/api', userRoutes);
app.use('/api', alumniRoutes);
app.use('/api', profileRoutes);
app.use('/api', eventRoutes);
app.use('/api', jobRoutes);
app.use('/api', donationRoutes);
app.use('/api', achievementRoutes);
app.use('/api', successStoryRoutes);
app.use('/api', socialLinksRoutes);
app.use('/api', detailsRoutes);
app.use('/api', updateProfileRoutes);

const { upload } = require('./cloudinaryConfig');

app.post('/upload', upload.single('video'), async (req, res) => {
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);
    
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }

    try {
        const { title, description, userName, domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

            // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { 
            resource_type: 'video' 
        });

        const newVideo = new Video({
            title,
            description,
            videoUrl: result.secure_url, // Cloudinary URL
            userName,
            domain,
        });

        await newVideo.save();

        res.status(201).json({
            message: 'Video uploaded successfully!',
            videoUrl: req.file.path, // Cloudinary URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

// Handle /login POST request
app.post('/login', async (req, res) => {
    try {
        const { rollNo, password } = req.body;
        console.log(req.body);
        if (!rollNo || !password) {
            return res.status(400).json({ message: 'Roll number and password are required' });
        }

        // Call the loginUser function
        const result = await loginUser(rollNo, password);

        // Send success response
        res.status(200).json(result);
    } catch (err) {
        console.error('Login error:', err.message);
        if (err.message === 'Invalid roll number or password') {
            res.status(401).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: err.message });
        }
    }
});

// Video List Route
app.get('/videos', async (req, res) => {
    try {
        const { domain } = req.query; // Get the domain from the query params

        let filter = {};
        if (domain) {
            filter.domain = domain; // Filter videos by domain if provided
        }

        const videos = await Video.find(filter); // Fetch filtered videos from the database
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});


app.post('/api/upload_project', upload.single('image'), async (req, res) => {
    try {
        console.log("Received Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { projectName, domain, description, percentageCompleted, endUser, teamLeaderName, emailId, department } = req.body;
        const imageUrl = req.file.path; // ✅ Now stores a Cloudinary URL
        // Cloudinary URL
        console.log(imageUrl);
        const newProject = new Project({
            projectName,
            domain,
            description,
            imageUrl, // Save Cloudinary URL
            percentageCompleted,
            endUser,
            teamLeaderName,
            emailId,
            department,
        });

        await newProject.save();
        res.status(200).json({ message: 'Project uploaded successfully!', imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload project', error: err });
    }
});


// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find(); // Fetch all projects from the database
        res.status(200).json({ projects });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Endpoint to fetch unique domains
app.get('/domains', async (req, res) => {
    try {
        const domains = await Video.distinct('domain'); // Get distinct domains
        res.json(domains);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
