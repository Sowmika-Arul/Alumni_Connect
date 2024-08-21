require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { truncate } = require('fs/promises');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const dbURI = process.env.MONGODB_URI;

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

const informationSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    phoneNumber: { type: String },
    linkedIn: { type: String },
    github: { type: String },
    leetcode: { type: String },
    achievements: [{ type: String }],
    successStory: [{ type: String }],
    pictures: [{ url: { type: String }, }]
}, { collection: 'Information' });

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    time: { type: String, required: true },
}, { collection: 'Events' });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Information = mongoose.model('Information', informationSchema);
const Event = mongoose.model('Event', eventSchema);

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

// Get information by rollNo
app.get('/get_information/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    try {
        const data = await Information.findOne({ rollNo });
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Information not found');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/add_information', upload.array('pictures', 10), async (req, res) => {
    const { rollNo, phoneNumber, linkedIn, github, leetcode, achievements, successStory } = req.body;
    const pictures = req.files.map(file => ({ url: file.path }));

    try {
        let info = await Information.findOne({ rollNo });

        if (info) {
            // Update existing record
            info.phoneNumber = phoneNumber;
            info.linkedIn = linkedIn;
            info.github = github;
            info.leetcode = leetcode;
            if (achievements) {
                info.achievements = Array.isArray(achievements) ? achievements : [achievements];
            }
            if (successStory) {
                info.successStory = Array.isArray(successStory) ? successStory : [successStory];
            }
            info.pictures = [...info.pictures, ...pictures];
        } else {
            // Create new record
            info = new Information({
                rollNo,
                phoneNumber,
                linkedIn,
                github,
                leetcode,
                achievements: Array.isArray(achievements) ? achievements : [achievements],
                successStory: Array.isArray(successStory) ? successStory : [successStory],
                pictures
            });
        }

        await info.save();
        res.status(200).send('Information saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// Fetch events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Add event
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

// Update event
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

// Delete event
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


  app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events' });
    }
  });
  
  app.post('/api/events', async (req, res) => {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error creating event' });
    }
  });
  app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (updatedEvent) {
            res.status(200).json({ event: updatedEvent });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

  
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);
      res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event' });
    }
  });
  const client = new MongoClient(dbURI);
  app.get('/alumni_list', async (req, res) => {
    try {
        const db = client.db('Alumni');
        const collection = db.collection('Alumni_Profile');  // Replace with your actual collection name

        // Create an empty query object
        const query = {};

        // Check each filter and add it to the query if it exists
        if (req.query.rollno) query.rollno = req.query.rollno;
        if (req.query.name) query.name = req.query.name;
        if (req.query.batch) query.batch = req.query.batch;
        if (req.query.department) query.department = req.query.department;
        if (req.query.specialization) query.specialization = req.query.specialization;
        if (req.query.location) query.location = req.query.location;
        if (req.query.industry) query.industry = req.query.industry;

        // Find and return profiles based on the query
        const profiles = await collection.find(query).toArray();
        res.json({ profiles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
