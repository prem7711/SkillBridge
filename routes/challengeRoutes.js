const express = require('express');
const router = express.Router();
const { createChallenge, getAllChallenges } = require('../controllers/challengeController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/verifyAdmin');

// For now, protect create route (can restrict to admin later)
router.post('/', protect, adminOnly, createChallenge);
router.get('/', protect, getAllChallenges);

module.exports = router;
