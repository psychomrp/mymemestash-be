// imports
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mailer = require('../mailer');
const cryptoRandomString = require('crypto-random-string');

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
            
            mailer.sendTemplatedEmail(email, 'Welcome to MyMemeStash', {
                title: 'Welcome to MyMemeStash',
                content: 
                `
                <p>Hey there @${username}!</p>
                <p>Get ready to dive into the fun-filled world of memes with MyMemeStash. We're thrilled to have you on board!</p>
                <p>At MyMemeStash, we believe that laughter is the best medicine, and we've got an endless supply of hilarious, entertaining, and addictive meme content just for you.</p>
                <p>Get ready to explore a treasure trove of memes, connect with fellow meme enthusiasts, and share the laughter with the world.</p>
                <p>Whether you're a meme connoisseur, a casual meme lover, or a meme-curious adventurer, MyMemeStash is here to make your days brighter, your funny bone tickled, and your meme stash overflowing!</p>
                <p>Join us now and embark on an epic journey of memes that will leave you smiling, laughing, and coming back for more.</p>
                <p>Stay tuned for daily meme updates, trending memes, and meme challenges that will keep you hooked.</p>
                <p>We can't wait to see you in the world of MyMemeStash!</p>
                `
            });

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
        return res.status(401).json({ error: 'Invalid email address' });
    }

    const randomString = cryptoRandomString({ length: 10 });
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const url = req.hostname + '/auth/password-reset/token/validate/' + randomString;

    await User.resetPassword({
        email: email,
        token: randomString,
        expires_at: expirationTime
    });

    mailer.sendTemplatedEmail(email, 'Password Reset Request', {
        title: 'Forgot Your Password?',
        content: 
        `
        <p>Hey there!</p>
        <p>We received a request to reset your password for your MyMemeStash account.</p>
        <p>If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <p><a class="button" href="https://yourapp.com/reset-password">Reset Password</a></p>
        <p>This link will expire in 24 hours for security purposes.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    });

    res.status(200).json({ message: 'Forgot Password Link Sent', email: email })
}

module.exports = { login, register, user, forgotPassword }