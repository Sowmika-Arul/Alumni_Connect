require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { truncate } = require('fs/promises');
const paypal = require('paypal-rest-sdk');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve images from uploads folder

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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

// Define schemas and models
const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'login' });

const adminSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'Admin_Login' });

const profileSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    name: { type: String },
    batch: { type: String },
    department: { type: String },
    specialization: { type: String },
    location: { type: String },
    industry: { type: String },
    photo: { type: String },
    email: { type: String },
}, { collection: 'Alumni_Profile' });


const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    time: { type: String, required: true },
}, { collection: 'Events' });


const donationSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    transactionId: { type: String, required: true },   
    timestamp: { type: Date, default: Date.now }
}, { collection: 'Donations' });

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

// Define Achievement Schema
const achievementSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String } // optional field for image URL
}, { collection: 'achievements' });

// Define Success Story Schema
const successStorySchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String } // optional field for image URL
}, { collection: 'success_stories' });

// Define Social Media Links Schema
const socialMediaLinksSchema = new mongoose.Schema({
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    website: { type: String }
}, { collection: 'social_media_links' });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Event = mongoose.model('Event', eventSchema);
const Donation = mongoose.model('Donation', donationSchema);
const Job = mongoose.model('Job', jobSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
const SocialMediaLinks = mongoose.model('SocialMediaLinks', socialMediaLinksSchema);


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Login route
app.post('/login', async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        let user = await User.findOne({ rollNo, password });

        if (user) {
            return res.status(200).json({ message: 'Login successful', role: 'user', rollNo });
        }

        let admin = await Admin.findOne({ rollNo, password });

        if (admin) {
            return res.status(200).json({ message: 'Admin login successful', role: 'admin', rollNo });
        }

        res.status(401).json({ message: 'Invalid roll number or password' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Fetch alumni profiles
app.get('/alumni_list', async (req, res) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).json({ profiles });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Fetch user profile by roll number
app.get('/profile/:rollNo', async (req, res) => {
    const { rollNo } = req.params;

    try {
        const profile = await Profile.findOne({ rollNo });

        if (profile) {
            res.status(200).json({ profile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Update profile by roll number
app.put('/profile/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { rollNo },
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedProfile) {
            res.status(200).json({ profile: updatedProfile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

app.get('/get_information/:rollNo', async (req, res) => {
    const rollNo = req.params.rollNo;

    try {
        // Query the database for achievements and success stories by roll number
        const achievements = await Achievement.find({ rollNo }); // Replace with correct query syntax for your DB
        const successStories = await SuccessStory.find({ rollNo }); // Replace with correct query syntax

        res.json({
            achievements: achievements || [], 
            successStories: successStories || []
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching achievements and success stories' });
    }
});

// Add Achievement
app.post('/add_achievement/:rollNo', upload.single('image'), async (req, res) => {
    const { title, description, date } = req.body; // Extract fields from the request body
    const { rollNo } = req.params;
    console.log(rollNo);
    // Validate required fields
    if (!title || !description) {
        return res.status(400).send('Title and description are required.');
    }

    const newAchievement = new Achievement({
        rollNo,
        title,
        description,
        date: date ? new Date(date) : new Date(), 
        imageUrl: req.file ? `uploads/${req.file.filename}` : null, // Save the image path if uploaded
    });

    try {
        // Save the new achievement to the database
        await newAchievement.save();
        // Respond with the newly created achievement
        res.status(201).json({ achievements: [newAchievement] });
    } catch (error) {
        console.error('Error saving achievement:', error);
        res.status(500).send('Server error while saving achievement.');
    }
});

app.post('/add_success_story/:rollNo', upload.single('image'), async (req, res) => {
    const { title, story, author } = req.body; // Get the fields from the form data
    const { rollNo } = req.params;

    // Validate required fields
    if (!title || !story) {
        return res.status(400).send('Title, story, author, and date are required.');
    }

    const newStory = new SuccessStory({
        rollNo,
        title,
        story,
        author,
        date: new Date(), // Use current date
        imageUrl: req.file ? `uploads/${req.file.filename}` : null, // Save the image path if uploaded
    });

    try {
        // Save the new story to the database
        await newStory.save();
        // Respond with the newly created story
        res.status(201).json({ successStories: [newStory] });
    } catch (error) {
        console.error('Error saving success story:', error);
        res.status(500).send('Server error while saving success story.');
    }
});


// Add Social Media Links
app.put('/add_social_links/:rollNo', async (req, res) => {
    try {
        const { linkedin, github, leetcode } = req.body;
        const profile = await Profile.findOne({ rollNo: req.params.rollNo });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        profile.socialLinks = { linkedin, github, leetcode };
        await profile.save();

        res.json({ socialLinks: profile.socialLinks });
    } catch (error) {
        res.status(500).json({ message: 'Error updating social links', error });
    }
});

app.get('/details/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    console.log(rollNo);

    try {
        const achievements = await Achievement.find({ rollNo }).lean();
        const successStories = await SuccessStory.find({ rollNo }).lean();

        // Log the data being sent in the response
        console.log('Achievements:', achievements);
        console.log('Success Stories:', successStories);

        // Return both achievements and success stories in a single response
        res.json({
            profile: {
                rollNo,
                achievements,
                successStories
            }
        });
    } catch (err) {
        console.error('Server error:', err); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

app.post('/events', async (req, res) => {
    const { name, date, venue, time } = req.body;

    try {
        const event = new Event({ name, date, venue, time });
        await event.save();
        res.status(200).json({ message: 'Event added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});


app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedEvent) {
            res.status(200).json({ event: updatedEvent });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});


app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (deletedEvent) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});


app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/jobs', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newJob = new Job({ title, description });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

   
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true } 
        );

        
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        res.json(updatedJob);
    } catch (error) {
        
        console.error('Error updating job:', error);
        res.status(400).json({ message: 'Error updating job', error: error.message });
    }
});



app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/donate', async (req, res) => {
    const { amount, rollNo, reason } = req.body;

    // Validate input fields
    if (!amount || !rollNo || !reason) {
        return res.status(400).json({ message: 'Donation amount, roll number, and reason are required' });
    }

    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: `http://localhost:${PORT}/success?rollNo=${encodeURIComponent(rollNo)}&reason=${encodeURIComponent(reason)}`,
            cancel_url: `http://localhost:${PORT}/cancel`
        },
        transactions: [{
            item_list: {
                items: [{
                    name: `Donation by ${rollNo}`,
                    sku: '001',
                    price: amount,
                    currency: 'USD',
                    quantity: 1
                }]
            },
            amount: {
                currency: 'USD',
                total: amount
            },
            description: 'Alumni donation'
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error('PayPal payment creation error:', error);
            return res.status(500).json({ message: 'Error creating PayPal payment', error: error.message });
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.json({ forwardLink: approvalUrl });
        }
    });
});

app.get('/success', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const rollNo = req.query.rollNo || 'Anonymous'; // Default to 'Anonymous' if no roll number provided
    const reason = req.query.reason || 'No reason provided'; // Added reason from query parameters

    // Fetch the payment details to get the amount
    paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
            console.error('Error fetching payment details:', error);
            return res.status(500).json({ message: 'Payment fetch failed' });
        } else {
            const amount = payment.transactions[0].amount.total; // Get the total amount from the fetched payment details

            const execute_payment_json = {
                payer_id: payerId,
                transactions: [{
                    amount: {
                        currency: 'USD',
                        total: amount // Use the fetched amount here
                    }
                }]
            };

            // Execute the payment
            paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                if (error) {
                    console.error('PayPal payment execution error:', error.response);
                    return res.status(500).json({ message: 'Payment failed' });
                } else {
                    // Store the donation details with the rollNo and reason
                    const donation = new Donation({
                        rollNo: rollNo,
                        amount: payment.transactions[0].amount.total,
                        reason: reason, // Save the reason in the database
                        transactionId: payment.id
                    });

                    try {
                        await donation.save(); // Save donation details to the database
                        res.json({ message: 'Thank you for your donation!' });
                    } catch (err) {
                        res.status(500).json({ message: 'Error saving donation details', error: err.message });
                    }
                }
            });
        }
    });
});

// Cancel route
app.get('/cancel', (req, res) => {
    res.json({ message: 'Payment canceled' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});