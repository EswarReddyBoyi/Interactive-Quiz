const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

// Submit Result
exports.submitResult = async (req, res) => {
  try {
    const { score, total, testID, userAnswers } = req.body;
    const quiz = await Quiz.findOne({ testID });

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // 🔒 Check existing attempts
    const attemptCount = await Result.countDocuments({
      testID,
      email: req.user.email,
    });

    if (attemptCount >= quiz.maxAttempts) {
        return res.status(403).json({ msg: `Attempt limit reached. Max allowed: ${quiz.maxAttempts}` });
    }


    const result = await Result.create({
      user: req.user.id,
      quiz: quiz._id,
      email: req.user.email,
      testID,
      testName: quiz.testName,
      score,
      total,
      userAnswers,
    });

    res.status(201).json({ msg: 'Result saved', result });
  } catch (err) {
    res.status(500).json({ msg: 'Error saving result', error: err.message });
  }
};

// Get all results for a user
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching results', error: err.message });
  }
};
