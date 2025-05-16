// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    totalScore: { type: Number, default: 0 },
    badges: [String],  // You can store badges as an array of strings.
});

module.exports = mongoose.model('Profile', ProfileSchema);
