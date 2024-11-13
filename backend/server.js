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


const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

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

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Video Upload Route
app.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }
    try {
        const newVideo = new Video({
            title: req.body.title,
            description: req.body.description,
            videoUrl: `/uploads/${req.file.filename}`
        });
        await newVideo.save();
        // Send the video URL in the response
        res.status(201).json({
            message: 'Video uploaded successfully!',
            videoUrl: `/uploads/${req.file.filename}` // Returning the video URL here
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

// Fetch All Videos Route
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
