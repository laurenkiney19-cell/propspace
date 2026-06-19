const jwt = require('jsonwebtoken');
const UserRepo = require('../repositories/user.repository');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  phone: user.phone,
});

const registerUser = async ({ username, email, password, fullName }) => {
  if (await UserRepo.findByEmail(email)) {
    const err = new Error('Email already registered.');
    err.status = 400;
    throw err;
  }
  if (await UserRepo.findByUsername(username)) {
    const err = new Error('Username already taken.');
    err.status = 400;
    throw err;
  }
  const user = await UserRepo.create({ username, email, password, fullName });
  return { token: generateToken(user._id), user: formatUser(user) };
};

const loginUser = async ({ email, password }) => {
  const userWithPwd = await User.findOne({ email });
  if (!userWithPwd || !(await userWithPwd.matchPassword(password))) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  return { token: generateToken(userWithPwd._id), user: formatUser(userWithPwd) };
};

module.exports = { registerUser, loginUser, generateToken, formatUser };
