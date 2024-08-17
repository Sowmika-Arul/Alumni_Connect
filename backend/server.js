require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection string from .env file
const dbURI = process.env.MONGODB_URI;

// Define Mongoose schemas and models for the collections
const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'login' });

const adminSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'Admin_Login' });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Login route
app.post('/login', async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        // First, check in the 'login' collection
        let user = await User.findOne({ rollNo, password });

        if (user) {
            return res.status(200).send({ message: 'Login successful' });
        }

        // If not found, check in the 'Admin_Login' collection
        let admin = await Admin.findOne({ rollNo, password });

        if (admin) {
            return res.status(200).send({ message: 'Admin login successful' });
        }

        // If neither is found
        res.status(401).send({ message: 'Invalid roll number or password' });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
