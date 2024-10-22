// src/services/detailsService.js
const Achievement = require('../models/achievementModel'); 
const SuccessStory = require('../models/successStoryModel'); 

const getProfileDetails = async (rollNo) => {
    const achievements = await Achievement.find({ rollNo }).lean();
    console.log(achievements);
    const successStories = await SuccessStory.find({ rollNo }).lean();

    return {
        rollNo,
        achievements,
        successStories
    };
};

module.exports = {
    getProfileDetails
};
