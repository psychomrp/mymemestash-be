// imports
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Login
const login = (req, res, next) => {
    // If the request data passes validation, proceed with further logic
    const { username, pass } = req.body;

    // Check if the user exists in the database
    User.getUserByUsername(username)
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify the user's password
            const isValidPassword = User.verifyPassword(user.password, pass);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

            // delete password from response
            delete user.password;

            // Send the token in the response
            res.status(200).json({ token: token, user: user });
        })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
}

// Register
const register = (req, res) => {
    const { username, email, pass } = req.body;

    User.createUser({username, email, pass})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Registration failed, kindly try again'});
            }

            const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

            delete user.password;

            res.status(200).json({ token: token, user: user})
        })
};

// Fetch user
const user = async (req, res) => {
    const userData = await User.getUserById(req.userId);

    delete userData.password;

    res.status(200).json({
        user: userData
    })
};

module.exports = { login, register, user }