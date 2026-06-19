const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json({ message: 'Account created successfully.', ...result });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const result = await AuthService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error during login.' });
  }
};

const getMe = async (req, res) => res.json({ user: req.user });

module.exports = { register, login, getMe };
