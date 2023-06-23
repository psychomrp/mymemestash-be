// imports
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mailer = require('../mailer');
const randomstring = require('randomstring');

// Login
const login = async (req, res, next) => {
    try {
        // If the request data passes validation, proceed with further logic
        const { username, pass } = req.body;

        // Check if the user exists in the database
        const user = await User.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the user's password
        const isValidPassword = await User.verifyPassword(user.password, pass);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

        // Delete password from response
        delete user.password;

        // Send the token in the response
        res.status(200).json({ token: token, user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Register
const register = (req, res) => {
    const { username, email, pass } = req.body;

    User.createUser({username, email, pass})
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: 'Registration failed, kindly try again'});
            }

            const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

            try {
                mailer.sendTemplatedEmail(email, 'Welcome to MyMemeStash', mailer.welcomeMail({username}));
            } catch(error) {
                console.log(error)
            }

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

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.getUserByEmail(email);

    if (!user) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const randomToken = randomstring.generate(20);
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const protocol = req.protocol
    const url = protocol + '://' + req.hostname + '/auth/password-reset/' + randomToken;

    await User.requestResetPassword({
        email: email,
        token: randomToken,
        expires_at: expirationTime
    });

    mailer.sendTemplatedEmail(email, 'Password Reset Request', mailer.forgotPasswordMail({url}));

    res.status(200).json({ message: 'Forgot Password Link Sent', email: email });
}

const forgotPasswordVerifyToken = async (req, res) => {
    const token = req.params.token;
    const tokenData = await User.getUserByResetToken(token);

    const email = tokenData.email;

    const user = await User.getUserByEmail(email);

    const newPassword = randomstring.generate(10);
    const hashedPassword = await User.hashPassword(newPassword);

    await User.updateUser(user.id, {
        password: hashedPassword
    });

    mailer.sendTemplatedEmail(email, 'Password Reset Successful', mailer.passwordSentMail({newPassword}));

    await User.deleteResetToken(token)

    res.status(200).json({ message: 'New Password Generated and Sent!', email: email })
}

const userUpdatePassword = async (req, res) => {
    const userData = await User.getUserById(req.userId);

    if (!userData) {
        throw new Error('User does not exist');
    }

    const userPass = userData.password;

    const checkPass = await User.verifyPassword(userPass, req.body.oldpass);

    if(!checkPass) {
        return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const newPassword = req.body.newpass;
    const hashedPassword = await User.hashPassword(newPassword);

    await User.updateUser(userData.id, {
        password: hashedPassword
    });

    mailer.sendTemplatedEmail(userData.email, 'Account Password Updated', mailer.paswordChangedMail({}));

    res.status(200).json({ message: 'New Password Updated' });
}

module.exports = { 
    login, 
    register, 
    user, 
    forgotPassword, 
    forgotPasswordVerifyToken, 
    userUpdatePassword 
};