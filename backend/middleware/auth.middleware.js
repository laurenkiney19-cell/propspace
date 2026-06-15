const jwt = require("jsonwebtoken");
const UserRepo = require("../repositories/user.repository");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserRepo.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "Token user no longer exists." });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

module.exports = { protect };