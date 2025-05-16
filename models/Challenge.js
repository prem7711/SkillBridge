const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  skill: { type: String, required: true },
  type: { type: String, enum: ['code', 'sql', 'api', 'video'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  sampleInput: String,
  expectedOutput: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', challengeSchema);
