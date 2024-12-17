const express = require('express');
const { signup,signinWithEmailPassword, signinWithEmail, signinWithPhone, signinWithSocial, verifyPhoneOtp, verifyEmailOtp, updatePassword, generateEmailOtpForgetPswd, forgetPswdVerifyEmailOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signinWithEmailPassword);
router.post('/signin-email', signinWithEmail);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/signin-phone', signinWithPhone);
router.post('/verify-phone-otp', verifyPhoneOtp);
router.post('/signin-social', signinWithSocial);


router.patch('/forget-password/request', generateEmailOtpForgetPswd); // Generate OTP for password reset
router.patch('/forget-password/verify', forgetPswdVerifyEmailOtp);    // Verify OTP for password reset
router.patch('/forget-password/update', updatePassword);             // Update password



module.exports = router;
