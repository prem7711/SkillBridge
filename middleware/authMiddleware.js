// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        console.log("prem");
        console.log(token);
        token = token.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("abc");
        console.log(token);
        console.log(decoded.userId);
        req.user = await User.findById(decoded.userId).select('-passwordHash');
        if (!req.user) throw new Error('User not found');

        next();
    } catch (err) {
        //console.log(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = protect;
