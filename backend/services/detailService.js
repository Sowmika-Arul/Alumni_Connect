// src/services/detailsService.js
const Achievement = require('../models/achievementModel'); 
const SuccessStory = require('../models/successStoryModel'); 
const socialMedia = require('../models/socialMediaModel');


const getProfileDetails = async (rollNo) => {
    const achievements = await Achievement.find({ rollNo }).lean();
    const successStories = await SuccessStory.find({ rollNo }).lean();
    const social_media_links = await socialMedia.find({ rollNo }).lean();

    return {
        rollNo,
        achievements,
        successStories,
        social_media_links
    };
};

module.exports = {
    getProfileDetails
};
