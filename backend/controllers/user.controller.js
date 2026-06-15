const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserRepo = require('../repositories/user.repository');

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const updated = await UserRepo.update(req.user._id, req.body);
    res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await UserRepo.findByIdWithPassword(req.user._id);
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await require('../models/User').findByIdAndUpdate(user._id, { password: hashed });
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating password.' });
  }
};

module.exports = { updateProfile, updatePassword };