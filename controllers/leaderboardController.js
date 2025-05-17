// controllers/leaderboardController.js
const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
    try {
        // 1. Fetch profiles, sorted by totalScore descending, populate user info

        console.log("Fetching leaderboard profiles for users only");

        // 1. First, fetch users with role = 'user'
        const users = await User.find({ role: 'user' }).select('_id name email');

        const userMap = {};
        users.forEach(user => {
            userMap[user._id.toString()] = user;
        });

        // 2. Fetch profiles that belong to these users
        const profiles = await Profile.find({
            userId: { $in: Object.keys(userMap) }
        }).sort({ totalScore: -1 });

        // 3. Map to leaderboard entries with rank
        const leaderboard = profiles.map((profile, index) => {
            const user = userMap[profile.userId.toString()];
            return {
                rank: index + 1,
                name: user.name,
                email: user.email,
                totalScore: profile.totalScore
            };
        });

        res.json(leaderboard);
    } catch (err) {
        console.error('Leaderboard fetch error:', err);
        res.status(500).json({ message: 'Server error fetching leaderboard.' });
    }
};
