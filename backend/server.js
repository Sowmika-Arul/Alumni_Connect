// Load environment variables
require('dotenv').config();

// Core imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');

// Models and Routes
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

// Initialize app
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: ['https://alumni-connect-1-deda.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// PayPal Configuration
paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage directly to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'uploads',
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
        format: file.mimetype.split('/')[1],
    }),
});
const upload = multer({ storage });

// Mount API routes
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

// ==========================
// Upload Video Endpoint
// ==========================
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        console.log('📦 Received File:', req.file);
        console.log('📝 Received Body:', req.body);

        if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

        const { title, description, userName, domain } = req.body;
        if (!domain) return res.status(400).json({ error: 'Domain is required' });

        const newVideo = new Video({
            title,
            description,
            videoUrl: req.file.path, // 🚀 Direct Cloudinary URL
            userName,
            domain,
        });

        await newVideo.save();

        res.status(201).json({ message: 'Video uploaded successfully!', videoUrl: req.file.path });
    } catch (error) {
        console.error('❌ Error uploading video:', error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

// ==========================
// Upload Project Endpoint
// ==========================
app.post('/api/upload_project', upload.single('image'), async (req, res) => {
    try {
        console.log('📦 Received File:', req.file);
        console.log('📝 Received Body:', req.body);

        const { projectName, domain, description, percentageCompleted, endUser, teamLeaderName, emailId, department } = req.body;

        const newProject = new Project({
            projectName,
            domain,
            description,
            imageUrl: req.file.path, // 🚀 Direct Cloudinary URL
            percentageCompleted,
            endUser,
            teamLeaderName,
            emailId,
            department,
        });

        await newProject.save();

        res.status(201).json({ message: 'Project uploaded successfully!', imageUrl: req.file.path });
    } catch (error) {
        console.error('❌ Error uploading project:', error);
        res.status(500).json({ error: 'Failed to upload project' });
    }
});

// ==========================
// Fetch Videos
// ==========================
app.get('/videos', async (req, res) => {
    try {
        const { domain } = req.query;
        let filter = {};
        if (domain) filter.domain = domain;

        const videos = await Video.find(filter);
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// ==========================
// Fetch Projects
// ==========================
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// ==========================
// Fetch Unique Domains
// ==========================
app.get('/domains', async (req, res) => {
    try {
        const domains = await Video.distinct('domain');
        res.status(200).json(domains);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});

// ==========================
// Health Check Endpoint
// ==========================
app.get('/health', (req, res) => {
    res.status(200).send('✅ Server is healthy 🚀');
});

// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
