// imports
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Login
const login = (req, res, next) => {
    // If the request data passes validation, proceed with further logic
    const { email, pass } = req.body;

    // Check if the user exists in the database
    User.getUserByEmail(email)
        .then(user => {
            if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify the user's password
            const isValidPassword = user.verifyPassword(pass);
            if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

            // Send the token in the response
            res.json({ token });
        })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
}

// Register
const register = (req, res) => {
    
}

module.exports = { login, register }