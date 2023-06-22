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
                return res.status(401).json({ error: 'Registration failed, kindly try again'});
            }

            const token = jwt.sign({ userId: user.id }, 'mymemestash', { expiresIn: '1h' });

            try {
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
        return res.status(401).json({ error: 'Invalid email address' });
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

    mailer.sendTemplatedEmail(email, 'Password Reset Request', {
        title: 'Forgot Your Password?',
        content: 
        `
        <p>Hey there!</p>
        <p>We received a request to reset your password for your MyMemeStash account.</p>
        <p>If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <p><a class="button" href="${url}">Reset Password</a></p>
        <p>You can also copy the link below if the button does not work:</p>
        <div class="password-section">
            <p><strong><a href="${url}">${url}</a></strong></p>
        </div>
        <p>This link will expire in 24 hours for security purposes.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    });

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

    mailer.sendTemplatedEmail(email, 'Password Reset Successful', {
        title: 'Your New Password',
        content: 
        `
        <p>Hey there!</p>
        <p>We have generated a new password for your MyMemeStash account as per your request.</p>
        <div class="password-section">
            <p><strong>Your New Password: </strong>${newPassword}</p>
        </div>
        <p>Please log in using your new password and consider changing it to a memorable one after logging in.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    });

    await User.deleteResetToken(token)

    res.status(200).json({ message: 'New Password Generated and Sent!', email: email })
}

module.exports = { login, register, user, forgotPassword, forgotPasswordVerifyToken }