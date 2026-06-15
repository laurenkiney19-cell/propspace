const User = require("../models/User");

const UserRepo = {
  findByEmail: (email) => User.findOne({ email }),
  findByUsername: (username) => User.findOne({ username }),
  findById: (id) => User.findById(id).select("-password"),
  findByIdWithPassword: (id) => User.findById(id),
  create: (data) => User.create(data),
  update: (id, data) => User.findByIdAndUpdate(id, data, { new: true }).select("-password"),
};

module.exports = UserRepo;