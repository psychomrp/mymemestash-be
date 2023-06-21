const express = require('express');
const router = express.Router();
const auth = require('./controllers/Auth')
const { validateLogin, checkValidationResult } = require('./validator');

// Index
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'mymemestash',
        version: 1
    })
});

// Auth
router.post('/auth/login', validateLogin, checkValidationResult, auth.login);

module.exports = router;
