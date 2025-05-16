const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        console.log("hello prem");
        const { name, email, password, skills, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, passwordHash, skills, role });
        await user.save();

        const profile = new Profile({
            userId: user._id,
            completedChallenges: [],
            totalScore: 0,
            badges: []
        });

        await profile.save();

        const token = generateToken(user._id, user.role);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, skills } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, user.role);
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
