const express = require('express');
const router = express.Router();
const { googleAuth } = require('../controllers/authController');
const {
  register,
  login,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.post('/google', googleAuth);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);

module.exports = router;
