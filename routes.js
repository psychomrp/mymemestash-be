const express = require('express');
const router = express.Router();
const auth = require('./controllers/Auth')
const { 
    validateLogin, 
    validateRegister, 
    validateForgotPassword,
    validateForgotPasswordToken,
    checkValidationResult,
} = require('./validator');
const { verifyToken } = require('./middleware');

// Index
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'mymemestash',
        version: 1
    });
});

// Auth [Guest]
router.post('/auth/login', validateLogin, checkValidationResult, auth.login);
router.post('/auth/register', validateRegister, checkValidationResult, auth.register);
router.post('/auth/password-reset', validateForgotPassword, checkValidationResult, auth.forgotPassword);
router.get('/auth/password-reset/:token', validateForgotPasswordToken, checkValidationResult, auth.forgotPasswordVerifyToken)
// Auth [Protected]
router.get('/auth/user', verifyToken, auth.user);
// router.post('/auth/user/update/password', verifyToken, auth.userUpdatePassword);

module.exports = router;
