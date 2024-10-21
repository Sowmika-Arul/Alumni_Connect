// src/controllers/alumniController.js
const alumniService = require('../services/alumniService');

const getAlumniList = async (req, res) => {
    try {
        const profiles = await alumniService.fetchAlumniProfiles();
        // console.log(profiles);
        res.status(200).json({ profiles });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

module.exports = {getAlumniList };
