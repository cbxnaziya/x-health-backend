const bcrypt = require("bcryptjs");
const { validateEmail, validatePhone } = require("../utils/validators"); // Validation utilities
const { sendOtpEmail, sendOtpPhone } = require("../utils/otpService");
const { generateOtp } = require("../utils/function");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const profile = require("../models/profile");

// done
const profileSave = async (req, res) => {
// Save Profile API
 
    try {
      const { userId, gender, nickname, religion, mood, religious } = req.body;
      console.log("profileSave......");
      
  
      // Validate required fields
      if (!userId || !gender) {
        return res.status(400).json({ error: 'userId and gender are required fields.' });
      }
  
      // Create a new profile instance
      const newProfile = new profile({
        userId,
        gender,
        nickname,
        religion,
        mood,
        religious,
      });
  
      // Save the profile to the database
      const savedProfile = await newProfile.save();
  
      // Send success response
      res.status(201).json({ message: 'Profile saved successfully.', profile: savedProfile });
    } catch (error) {
      console.error('Error saving profile:', error);
      res.status(500).json({ error: 'An error occurred while saving the profile.' });
    }
  

};

module.exports = {profileSave}
