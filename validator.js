const { body, validationResult } = require('express-validator');

exports.validateLogin = [
  body('email').notEmpty().withMessage('Email is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('pass').notEmpty().withMessage('Password is required'),
  body('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};