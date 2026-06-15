const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserRepo = require('../repositories/user.repository');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, email, password, fullName } = req.body;
  try {
    if (await UserRepo.findByEmail(email)) return res.status(400).json({ message: 'Email already registered.' });
    if (await UserRepo.findByUsername(username)) return res.status(400).json({ message: 'Username already taken.' });
    const user = await UserRepo.create({ username, email, password, fullName });
    res.status(201).json({
      message: 'Account created successfully.',
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, avatar: user.avatar, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const userWithPwd = await require('../models/User').findOne({ email });
    if (!userWithPwd) return res.status(401).json({ message: 'Invalid email or password.' });
    const isMatch = await userWithPwd.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({
      token: generateToken(userWithPwd._id),
      user: { id: userWithPwd._id, username: userWithPwd.username, email: userWithPwd.email, fullName: userWithPwd.fullName, avatar: userWithPwd.avatar, phone: userWithPwd.phone },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const getMe = async (req, res) => res.json({ user: req.user });

module.exports = { register, login, getMe };