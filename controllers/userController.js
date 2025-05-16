// controllers/userController.js
const Profile = require('../models/Profile');

exports.createProfile = async (userId) => {
    const newProfile = new Profile({
        userId,
        completedChallenges: [],
        totalScore: 0,
        badges: []
    });
    await newProfile.save();
};
