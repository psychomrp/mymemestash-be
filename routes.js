const express = require('express');
const router = express.Router();
const auth = require('./controllers/Auth')
const stash = require('./controllers/Stash');
const { 
    validateLogin, 
    validateRegister, 
    validateForgotPassword,
    validateForgotPasswordToken,
    validateUpdatePassword,
    validateCreateUserStash,
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

/**
 * /auth Routes [guest]
 */
router.post('/auth/login', validateLogin, checkValidationResult, auth.login);
router.post('/auth/register', validateRegister, checkValidationResult, auth.register);
router.post('/auth/password-reset', validateForgotPassword, checkValidationResult, auth.forgotPassword);
router.get('/auth/password-reset/:token', validateForgotPasswordToken, checkValidationResult, auth.forgotPasswordVerifyToken)
/**
 * /auth Routes [Protected]
 */
router.get('/auth/user', verifyToken, auth.user);
router.post('/auth/user/update/password', verifyToken, validateUpdatePassword, checkValidationResult, auth.userUpdatePassword);
/**
 * /stash Routes [Protected]
 */
router.get('/stash/user', verifyToken, stash.fetchUserStash);
router.post('/stash/user', verifyToken, validateCreateUserStash, checkValidationResult, stash.createUserStash);

module.exports = router;
