// src/services/socialLinksService.js
const Profile = require('../models/socialMediaModel'); // Adjust the path to your Profile model

const updateSocialLinks = async (rollNo, socialLinks) => {
    const profile = await Profile.findOne({ rollNo });
    if (!profile) {
        throw new Error('Profile not found');
    }

    // Update the profile's social links
    profile.socialLinks = socialLinks;
    await profile.save();
    return profile.socialLinks;
};

module.exports = {
    updateSocialLinks
};
