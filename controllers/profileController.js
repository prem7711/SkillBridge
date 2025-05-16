// controllers/profileController.js
const Profile = require('../models/Profile');

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id })
        .populate('completedChallenges')
        .populate('userId', 'name email skills');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// controllers/profileController.js
exports.addBadge = async (userId, badge) => {
    const profile = await Profile.findOne({ userId });
    if (!profile) return;

    if (!profile.badges.includes(badge)) {
        profile.badges.push(badge);
        await profile.save();
    }
};

