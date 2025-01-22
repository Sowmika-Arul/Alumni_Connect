require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
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
        const { title, description, userName, domain } = req.body; // Extract domain from the request body

        // Ensure domain is provided
        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        // Create a new video entry with the provided data
        const newVideo = new Video({
            title,
            description,
            videoUrl: `/uploads/${req.file.filename}`,
            userName, // Store the user's name
            domain,   // Store the domain
        });

        // Save the new video entry to the database
        await newVideo.save();

        // Send the response back with a success message and video URL
        res.status(201).json({
            message: 'Video uploaded successfully!',
            videoUrl: `/uploads/${req.file.filename}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload video' });
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


// Endpoint to upload a project
app.post('/api/upload_project', upload.single('image'), async (req, res) => {
    try {
        const { projectName, domain, description, percentageCompleted, endUser, teamLeaderName, emailId, department } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        const newProject = new Project({
            projectName,
            domain,
            description,
            imageUrl,
            percentageCompleted,
            endUser,
            teamLeaderName,
            emailId,
            department,
        });

        await newProject.save();
        res.status(200).json({ message: 'Project uploaded successfully!' });
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

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Hashed password
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
  logger: true,
});

// Route: Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email });
    await user.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const verificationLink = `http://localhost:5050/verify-email/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error in /signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route: Verify Email
app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If already verified, skip saving again
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Redirect to the frontend password setting route
    res.redirect(`https://alumni-connect-1-deda.onrender.com/set-password`);
  } catch (error) {
    console.error("Error in /verify-email:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Route: Set Password
app.post("/set-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password set successfully. You can now login." });
  } catch (error) {
    console.error("Error in /set-password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
