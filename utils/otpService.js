const nodemailer = require('nodemailer');
const crypto = require('crypto');  // To generate OTPs

// Utility to send OTP to the provided email address
const sendOtpEmail = async (email, otp) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: email,                    // recipient address
    subject: 'Your OTP Code',     // Subject line
    text: `Your OTP code is ${otp}`,  // OTP message body
  };

  try {
    // Send OTP via email
    await transporter.sendMail(mailOptions);
  
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Error sending OTP');
  }
};


