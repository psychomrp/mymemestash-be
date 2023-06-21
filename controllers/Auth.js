// imports
const UserModel = require('../models/User');
const { body, validationResult } = require('express-validator');

// Login
const login = (req, res) => {
    // Validations
    const validations = [
        body('email').notEmpty.isEmail().withMessage('Invalid Email'),
        body('pass').notEmpty().withMessage('Password is required')
    ];

    // Apply validations
    validations.forEach(validation => validation(req, res));

    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If the request data passes validation, proceed with further logic
    const { email, pass } = req.body;

    // Proceed with further logic
    res.json({ status: 'ok' });
}

// Register
const register = (req, res) => {
    
}

module.exports = { login, register }