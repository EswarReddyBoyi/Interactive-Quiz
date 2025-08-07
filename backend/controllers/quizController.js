const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

exports.createQuiz = async (req, res) => {
  try {
    const { testName, maxAttempts, timeLimit, questions } = req.body;

    const { nanoid } = await import('nanoid');
    const testID = nanoid(6).toUpperCase(); 

    const quiz = await Quiz.create({
      testName,
      testID,
      maxAttempts,
      timeLimit,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({ msg: 'Quiz created successfully', testID, quiz });
  } catch (err) {
    console.error('Quiz creation failed:', err.message);
    res.status(500).json({ msg: 'Failed to create quiz', error: err.message });
  }
};

exports.getQuizByTestID = async (req, res) => {
  try {
    const testID = req.params.testID;
    const email = req.user.email;

    const quiz = await Quiz.findOne({ testID });
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    const attemptCount = await Result.countDocuments({ testID, email });

    if (attemptCount >= quiz.maxAttempts) {
      return res.status(403).json({
        msg: `Maximum attempts reached (${quiz.maxAttempts}). You have already attempted this test.`,
      });
    }

    res.json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err.message);
    res.status(500).json({ msg: 'Error fetching quiz', error: err.message });
  }
};

