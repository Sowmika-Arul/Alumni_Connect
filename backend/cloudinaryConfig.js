const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads', // ✅ Change if needed
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'avi'],
    },
});

// Multer Upload Middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
