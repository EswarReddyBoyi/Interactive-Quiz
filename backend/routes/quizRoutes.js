const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizByTestID,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

router.post('/create', protect, createQuiz);
router.get('/:testID', protect, getQuizByTestID);

router.get('/attempts/:testID', protect, async (req, res) => {
  try {
    const { testID } = req.params;
    const quiz = await Quiz.findOne({ testID });

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    const attemptCount = await Result.countDocuments({
      testID,
      email: req.user.email,
    });

    res.json({
      attempts: attemptCount,
      maxAttempts: quiz.maxAttempts,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
