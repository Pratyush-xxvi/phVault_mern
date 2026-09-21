const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    if (await User.findOne({ $or: [{ username }, { email }] }))
      return res.status(409).json({ success: false, message: 'Username or email already exists' });

    const allowedRole = role === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_CUSTOMER';
    const user = await User.create({ username, email, password, role: allowedRole });
    const token = generateToken(user._id);

    // Send welcome email in background (non-blocking)
    sendWelcomeEmail(user).catch(err => console.error('[Welcome Email Error]', err));

    res.status(201).json({
      success: true,
      data: { token, ...user.toSafeObject() },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      data: { token, ...user.toSafeObject() },
    });
  } catch (err) { next(err); }
};

module.exports = { register, login };
