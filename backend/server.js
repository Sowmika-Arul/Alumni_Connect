require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5050;


app.use(express.json());
app.use(cors()); 


const dbURI = process.env.MONGODB_URI;

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
    industry: { type: String }
}, { collection: 'Alumni_Profile' });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Profile = mongoose.model('Profile', profileSchema);


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));


app.post('/login', async (req, res) => {
    const { rollNo, password } = req.body;

    try {
       
        let user = await User.findOne({ rollNo, password });

        if (user) {
            return res.status(200).json({ message: 'Login successful' });
        }

        
        let admin = await Admin.findOne({ rollNo, password });

        if (admin) {
            return res.status(200).json({ message: 'Admin login successful' });
        }

        
        res.status(401).json({ message: 'Invalid roll number or password' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});


app.get('/alumni_list', async (req, res) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).json({ profiles });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
