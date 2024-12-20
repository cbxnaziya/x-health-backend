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
      if (!userId || !gender || !nickname ||  !religion ||  !mood ||  !religious ) {
        return res.status(400).json({ error: 'All fields are required.' });
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

const updateProfile = async (req, res) => {
  console.log(req.id,"req.id");
  const userId  = req.id;
  
  try {
    const {  ...fieldsToUpdate } = req.body;

    console.log("updateProfile API called...");

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Update the profile and return the updated document
    const updatedProfile = await profile.findOneAndUpdate(
      { userId }, // Query to find the profile
      { $set: fieldsToUpdate }, // Update only provided fields
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    // Send success response
    res.status(200).json({ message: 'Profile updated successfully.', profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'An error occurred while updating the profile.' });
  }
};



module.exports = {profileSave, updateProfile}
