const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  email: String,
  testID: String,
  testName: String,
  score: Number,
  total: Number,
  answers: [String], 
  attemptDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
