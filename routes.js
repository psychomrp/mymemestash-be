const express = require('express');
const router = express.Router();
const auth = require('./controllers/Auth')
const { validateLogin, validateRegister, checkValidationResult } = require('./validator');
const { verifyToken } = require('./middleware');

// Index
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'mymemestash',
        version: 1
    });
});

// Auth
router.post('/auth/login', validateLogin, checkValidationResult, auth.login);
router.post('/auth/register', validateRegister, checkValidationResult, auth.register);
router.get('/auth/user', verifyToken, auth.user);

module.exports = router;
