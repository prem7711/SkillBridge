// controllers/recommendationsController.js
const Challenge = require('../models/Challenge');
const Profile = require('../models/Profile');

exports.getRecommendations = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id }).populate('completedChallenges');
        const completedSkills = profile.completedChallenges.map(challenge => challenge.skill);
        const recommendedChallenges = await Challenge.find({ skill: { $in: completedSkills } }).limit(5);

        res.status(200).json(recommendedChallenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};
