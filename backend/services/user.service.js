const bcrypt = require('bcryptjs');
const UserRepo = require('../repositories/user.repository');
const User = require('../models/User');

const updateProfile = (userId, data) => UserRepo.update(userId, data);

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await UserRepo.findByIdWithPassword(userId);
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    const err = new Error('Current password is incorrect.');
    err.status = 400;
    throw err;
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  await User.findByIdAndUpdate(user._id, { password: hashed });
};

module.exports = { updateProfile, updatePassword };
