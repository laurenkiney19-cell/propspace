const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { updateProfile, updatePassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.put('/profile', protect, [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be blank.'),
  body('phone').optional().trim(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL.'),
], updateProfile);

router.put('/password', protect, [
  body('oldPassword').notEmpty().withMessage('Current password required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
], updatePassword);

module.exports = router;