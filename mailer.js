const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const emailTemplatePath = path.join(__dirname, 'mail/template.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

// Create a transporter using SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  defaultFrom: process.env.SMTP_FROM
});

// Function to send a templated email
const sendTemplatedEmail = (recipientEmail, subject, templateData) => {
    const { title, content } = templateData;
  
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: recipientEmail,
      subject: subject,
      html: emailTemplate.replace('{{title}}', title).replace('{{content}}', content),
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
};

// Templates
const welcomeMail = (data) => {
    return {
        title: 'Welcome to MyMemeStash',
        content: 
        `
        <p>Hey there @${data.username}!</p>
        <p>Get ready to dive into the fun-filled world of memes with MyMemeStash. We're thrilled to have you on board!</p>
        <p>At MyMemeStash, we believe that laughter is the best medicine, and we've got an endless supply of hilarious, entertaining, and addictive meme content just for you.</p>
        <p>Get ready to explore a treasure trove of memes, connect with fellow meme enthusiasts, and share the laughter with the world.</p>
        <p>Whether you're a meme connoisseur, a casual meme lover, or a meme-curious adventurer, MyMemeStash is here to make your days brighter, your funny bone tickled, and your meme stash overflowing!</p>
        <p>Join us now and embark on an epic journey of memes that will leave you smiling, laughing, and coming back for more.</p>
        <p>Stay tuned for daily meme updates, trending memes, and meme challenges that will keep you hooked.</p>
        <p>We can't wait to see you in the world of MyMemeStash!</p>
    `
    }
};

const forgotPasswordMail = (data) => {
    return {
        title: 'Forgot Your Password?',
        content: 
        `
        <p>Hey there!</p>
        <p>We received a request to reset your password for your MyMemeStash account.</p>
        <p>If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <p><a class="button" href="${data.url}">Reset Password</a></p>
        <p>You can also copy the link below if the button does not work:</p>
        <div class="password-section">
            <p><strong><a href="${data.url}">${data.url}</a></strong></p>
        </div>
        <p>This link will expire in 24 hours for security purposes.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    }
};

const passwordSentMail = (data) => {
    return {
        title: 'Your New Password',
        content: 
        `
        <p>Hey there!</p>
        <p>We have generated a new password for your MyMemeStash account as per your request.</p>
        <div class="password-section">
            <p><strong>Your New Password: </strong>${data.newPassword}</p>
        </div>
        <p>Please log in using your new password and consider changing it to a memorable one after logging in.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    }
}

const paswordChangedMail = (data) => {
    return {
        title: 'Password Updated',
        content: 
        `
        <p>Hey there!</p>
        <p>We have updated a password change request for your account.</p>
        <p>If you did not carry out this action kindly reset your password and change the password to your email as well.</p>
        <p>If you continue to experience any issues, please reach out to our support team for assistance.</p>  
        `
    }
}
  
module.exports = {
    sendTemplatedEmail,
    welcomeMail,
    passwordSentMail,
    forgotPasswordMail,
    paswordChangedMail
};