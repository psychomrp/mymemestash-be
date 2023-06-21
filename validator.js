const { body, validationResult } = require('express-validator');
const knex = require('knex')(require('./knexfile').development);

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const checkUsernameExists = async (value) => {
    const user = await knex('users').where('username', value).first();
    if (user) {
      throw new Error('Username already exists');
    }
};

exports.validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('username')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Invalid username. Usernames must not contain special symbols except underscore (_) and must not contain numbers or special characters.'),
    body('pass').notEmpty().withMessage('Password is required'),
    body('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];


exports.validateRegister = [
    body('username').notEmpty().withMessage('Username is required'),
    body('username')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Invalid username. Usernames must not contain special symbols except underscore (_) and must not contain numbers or special characters.'),
    body('username').notEmpty().custom(checkUsernameExists).withMessage('Username already exists'),
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('pass').notEmpty().withMessage('Password is required'),
    body('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];