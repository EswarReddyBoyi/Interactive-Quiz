const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'TRUE_FALSE', 'BLANK'], default: 'MCQ' },
  options: [{ type: String }],
  correctAnswer: { type: String },
  hint: { type: String },
  image: { type: String, default: '' }  
});

const quizSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  testID: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  maxAttempts: { type: Number, default: 1 },
  timeLimit: { type: Number, required: true, min: 1,},
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Quiz', quizSchema);
