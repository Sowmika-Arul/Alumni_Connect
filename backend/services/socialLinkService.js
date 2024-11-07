// src/services/socialLinksService.js
const SocialMedia = require('../models/socialMediaModel'); // Ensure this is the correct path to your model

const updateSocialLinks = async (rollNo, socialLinks) => {
    // Find the existing social media links by rollNo
    let profile = await SocialMedia.findOne({ rollNo });
    
    if (!profile) {
        // If no profile exists, create a new one
        profile = new SocialMedia({ rollNo, ...socialLinks });
    } else {
        // Update the existing profile's social links
        profile.leetcode = socialLinks.leetcode || profile.leetcode;
        profile.linkedin = socialLinks.linkedin || profile.linkedin;
        profile.github = socialLinks.github || profile.github;
        profile.portfolio = socialLinks.portfolio || profile.portfolio;
        profile.resume = socialLinks.resume || profile.resume;
    }

    await profile.save();
    return profile; 
};

module.exports = {
    updateSocialLinks
};
