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
  
module.exports = {
    sendTemplatedEmail,
};