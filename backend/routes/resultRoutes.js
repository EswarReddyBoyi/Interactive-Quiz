const express = require('express');
const router = express.Router();
const {
  submitResult,
  getUserResults
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitResult);
router.get('/myresults', protect, getUserResults);

module.exports = router;
