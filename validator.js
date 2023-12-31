const { body, param, validationResult } = require('express-validator');
const knex = require('knex')(require('./knexfile').development);
const User = require('./models/User');

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

const checkEmailExists = async (value) => {
    const user = await knex('users').where('email', value).first();
    if (user) {
        throw new Error('Email already exists');
    }
}

const checkEmailDoesNotExists = async (value) => {
    const user = await knex('users').where('email', value).first();
    if (!user) {
        throw new Error('Email does not exist');
    }
}

const checkIfResetTokenExists = async (value) => {
    const pwdReset = await knex('password_resets').where('token', value).first();
    if(!pwdReset) {
        throw new Error('Token does not exist');
    }
}

const checkIfResetTokenHasExpired = async (value) => {
    const pwdReset = await knex('password_resets').where('token', value).first();
    const expiresAt = new Date(pwdReset.expires_at);
  
    if (new Date() > expiresAt) {
      throw new Error('Token has expired');
    }
}

const checkIfStashCodeIsValid = async (value) => {
    const fetchStashByCode = await knex('stashes').where('stash_code', value).first();
    if(!fetchStashByCode) {
        throw new Error('Stash code is invalid');
    }
}

// Custom validation function to check for whitespace in array elements
const noWhitespace = (value) => {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === 'string' && /\s/.test(value[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
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
    body('email').notEmpty().custom(checkEmailExists).withMessage('Email already exists'),
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('pass').notEmpty().withMessage('Password is required'),
    body('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('cpass').notEmpty().withMessage('Password Confirmation is required'),
    body('cpass').isLength({ min: 6 }).withMessage('Password Confirmation must be at least 6 characters long'),
    body('cpass')
    .custom((value, { req }) => {
        if (value !== req.body.pass) {
        throw new Error('Password confirmation does not match');
        }
        return true;
    })
    .withMessage('Password confirmation does not match')
];

exports.validateForgotPassword = [
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('email').custom(checkEmailDoesNotExists).withMessage('Email does not exist')
];

exports.validateForgotPasswordToken = [
    param('token').notEmpty().withMessage('Token is required'),
    param('token').custom(checkIfResetTokenExists).withMessage('Token does not exist'),
    param('token').custom(checkIfResetTokenHasExpired).withMessage('Token has expired')
];

exports.validateUpdatePassword = [
    body('oldpass').notEmpty().withMessage('Old password is required'),
    body('newpass').notEmpty().withMessage('New password is required'),
    body('cnewpass').notEmpty().withMessage('New password confirmation is required'),
    body('cnewpass')
    .custom((value, { req }) => {
        if (value !== req.body.cnewpass) {
            return false;
        }
        return true;
    })
    .withMessage('New password confirmation does not match')
]

exports.validateCreateUserStash = [
    body('title').notEmpty().withMessage('Title is required'),
    body('tags').notEmpty().withMessage('Tags is required'),
    body('tags').isArray().withMessage('Tags must an array'),
    body('tags').custom(noWhitespace).withMessage('Tags must not contain whitespace'),
    body('privacy').notEmpty().withMessage('Privacy is required'),
    body('privacy').isIn(['public', 'private']).withMessage('Access type must be either public or private')
]

exports.validateEditUserStash = [
    body('stash_code').notEmpty().withMessage('Stash Code is required'),
    body('stash_code').custom(checkIfStashCodeIsValid).withMessage('Stash Code is invalid'),
    body('title').notEmpty().withMessage('Title is required'),
    body('tags').notEmpty().withMessage('Tags is required'),
    body('tags').isArray().withMessage('Tags must an array'),
    body('tags').custom(noWhitespace).withMessage('Tags must not contain whitespace'),
    body('privacy').notEmpty().withMessage('Privacy is required'),
    body('privacy').isIn(['public', 'private']).withMessage('Access type must be either public or private')
]

exports.validateDeleteUserStash = [
    body('stash_code').notEmpty().withMessage('Stash Code is required'),
    body('stash_code').custom(checkIfStashCodeIsValid).withMessage('Stash Code is invalid')
]

exports.validateUploadUserStash = [
    param('stash_code').notEmpty().withMessage('Stash Code is required'),
    param('stash_code').custom(checkIfStashCodeIsValid).withMessage('Stash code is invalid')
]

exports.validateFetchSingleUserStash = [
    param('stash_code').notEmpty().withMessage('Stash Code is required'),
    param('stash_code').custom(checkIfStashCodeIsValid).withMessage('Stash code is invalid')
]