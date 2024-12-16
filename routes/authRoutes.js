const express = require('express');
const { signup, signinWithEmail, signinWithPhone, signinWithSocial, verifyPhoneOtp, generateOtpForEmail, verifyEmailOtp, updatePassword, generateEmailOtpForgetPswd, forgetPswdVerifyEmailOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin-email', signinWithEmail);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/signin-phone', signinWithPhone);
router.post('/verify-phone-otp', verifyPhoneOtp);
router.post('/signin-social', signinWithSocial);


router.patch('/password/reset/request', generateEmailOtpForgetPswd); // Generate OTP for password reset
router.patch('/password/reset/verify', forgetPswdVerifyEmailOtp);    // Verify OTP for password reset
router.patch('/password/reset/update', updatePassword);             // Update password



module.exports = router;
