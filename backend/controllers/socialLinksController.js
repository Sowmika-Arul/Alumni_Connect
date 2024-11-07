// src/controllers/socialLinksController.js
const socialLinksService = require('../services/socialLinkService'); // Ensure the path is correct

const updateSocialLinks = async (req, res) => {
    const { rollNo } = req.params;
    const { leetcode, linkedin, github, portfolio, resume } = req.body; // Destructure body for convenience
    console.log(req.body);

    try {
        // Call the service to update social links
        const updatedSocialLinks = await socialLinksService.updateSocialLinks(rollNo, { leetcode, linkedin, github, portfolio, resume });
        res.json({ socialLinks: updatedSocialLinks });
    } catch (error) {
        if (error.message === 'Profile not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error updating social links', error: error.message });
    }
};

module.exports = {
    updateSocialLinks
};
