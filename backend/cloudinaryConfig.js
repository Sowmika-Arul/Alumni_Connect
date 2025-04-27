// src/cloudinaryConfig.js
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
    params: async (req, file) => {
        return {
            folder: 'uploads', // Folder name in Cloudinary
            format: file.mimetype.split('/')[1], // Auto-detect file format (e.g., 'jpeg', 'png')
            resource_type: file.mimetype.startsWith('video') ? 'video' : 'image', // Handle videos as videos
        };
    },
});

// Multer Upload Middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
