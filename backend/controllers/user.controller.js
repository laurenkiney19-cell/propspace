const { validationResult } = require('express-validator');
const UserService = require('../services/user.service');

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const updated = await UserService.updateProfile(req.user._id, req.body);
    res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error updating profile.' });
  }
};

const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, newPassword } = req.body;
  try {
    await UserService.updatePassword(req.user._id, oldPassword, newPassword);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error updating password.' });
  }
};

module.exports = { updateProfile, updatePassword };
