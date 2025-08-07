const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');


// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'google_oauth' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(401).json({ msg: 'Google verification failed' });
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error registering user', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error logging in', error: err.message });
  }
};

// Get current user
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
