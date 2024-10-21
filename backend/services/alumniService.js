// src/services/alumniService.js
const Profile = require('../models/profileModel'); // Ensure the path is correct

const fetchAlumniProfiles = async () => {
    // console.log(Profile);
    return await Profile.find({});
};

module.exports = { fetchAlumniProfiles };
