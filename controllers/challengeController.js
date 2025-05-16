const Challenge = require('../models/Challenge');

exports.createChallenge = async (req, res) => {
    try {
        const { title, description, skill, type, difficulty, sampleInput, expectedOutput } = req.body;

        const challenge = new Challenge({
            title, description, skill, type, difficulty, sampleInput, expectedOutput
        });

        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ createdAt: -1 });
        res.status(200).json(challenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const { addBadge } = require('./profileController');

exports.completeChallenge = async (userId, challengeId) => {
    // Logic for completing the challenge (e.g., marking the challenge as complete)
    const profile = await Profile.findOne({ userId });
    profile.completedChallenges.push(challengeId);
    await profile.save();

    // Award badge for completing 5 challenges
    if (profile.completedChallenges.length >= 5) {
        addBadge(userId, 'Challenge Master');
    }
};