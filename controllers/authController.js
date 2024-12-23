const bcrypt = require("bcryptjs");
const { validateEmail, validatePhone } = require("../utils/validators"); // Validation utilities
const { sendOtpEmail, sendOtpPhone } = require("../utils/otpService");
const { generateOtp } = require("../utils/function");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// done
const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    preferred_language,
    device_token,
    device_id,
  } = req.body;

  // Input validation
  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !preferred_language ||
    !device_token ||
    !device_id
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  if (!validatePhone(phone)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format." });
  }

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail?.email === email) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone?.phone === phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      preferred_language,
      device_token,
      device_id,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      // user: {
      //   id: newUser.id,
      //   name: newUser.name,
      //   email: newUser.email,
      //   phone: newUser.phone,
      //   preferred_language: newUser.preferred_language,
      // },
    });
  } catch (error) {
    console.error("Error during user signup:", error);

    // Handle unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path || "unknown";
      const message =
        field === "email"
          ? "Email already in use."
          : field === "phone"
          ? "Phone number already in use."
          : `Duplicate entry in ${field}.`;

      return res.status(400).json({ success: false, message });
    }

    // Handle other server errors
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


const signinWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    // Find user by email
    const existingUser = await User.findOne({ email } );

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email ,role: existingUser.role  },
      process.env.JWT_SECRET,
      // { expiresIn: "1h" } // Token expires in 1 hour
    );
    // const existingUser = await User.findOne({ email });
    // Use the `set` method to set the values on the instance
    existingUser.set({
      token: token, // Update the email_otp field
    });

    // Save the updated instance back to the database
    await existingUser.save();
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token, // Return the JWT token
    
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};



//done
const signinWithEmail = async (req, res) => {
  const { email, password, preferred_language, device_token, device_id } =
    req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    // Check if the user exists by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password." });
    }

    // Generate OTP
    const otp = generateOtp(); // Utility function to generate a random OTP

    // Send OTP to user's registered email
    const otpSent = await sendOtpEmail(user.email, otp);

    const existingUser = await User.findOne({ email });
    // Use the `set` method to set the values on the instance
    existingUser.set({
      email_otp: otp, // Update the email_otp field
    });

    // Save the updated instance back to the database
    await existingUser.save();

    if (!otpSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    // Return success and user data (excluding password)
    return res.status(200).json({
      success: true,
      message: "OTP sent to email.",
      // user: {
      //   id: user.id,
      //   name: user.name,
      //   email: user.email,
      //   phone: user.phone,
      //   preferred_language: preferred_language || user.preferred_language, // Include provided preferred language or use stored
      //   device_token, // Include device token
      //   device_id, // Include device ID
      // },
      // otp: otp, // Optionally return OTP for testing or further validation (remove in production)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// done
// Verify OTP  on forget password
const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  try {
    // Check if the OTP exists in the database
    const existingUser = await User.findOne({ email_otp: otp });

    if (!existingUser || existingUser.email !== email ) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check if OTP has expired
    if (new Date() > existingUser.expires_at) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }
       // Generate a JWT token
       const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email,role: existingUser.role  },
        process.env.JWT_SECRET,
        // { expiresIn: "1h" } // Token expires in 1 hour
      );
      // const existingUser = await User.findOne({ email });
      // Use the `set` method to set the values on the instance
      existingUser.set({
        token: token, // Update the email_otp field
      });
  
      // Save the updated instance back to the database
      await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      token, // Return the JWT token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


// done
// Signin with phone and OTP
const signinWithPhone = async (req, res) => {
  const { phone, preferred_language, device_token, device_id ,country_code} = req.body;
console.log("req.body",req.body);

  // Validate input
  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone and OTP are required." });
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const otp = generateOtp();

    // Send OTP to user's registered email
    const otpSent = await sendOtpPhone(otp,phone,country_code);

    if (!otpSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    // const existingUser = await User.findOne({ email });
    // Use the `set` method to set the values on the instance
    existingUser.set({
      phone_otp: otp, // Update the email_otp field
    });

    // Save the updated instance back to the database
    await existingUser.save();



    // Return success and user data (excluding password)
    return res.status(200).json({
      success: true,
      message: "OTP sent to Phone.",
  
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

//done
// Verify phone OTP
const verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  // Validate input
  if (!phone || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone and OTP are required." });
  }

  try {
    // Check if the OTP matches the saved OTP for the phone
    const user = await User.findOne({ phone });

    if (user.phone_otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // OTP is verified, clear OTP field
    await user.save();
        // Generate a JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email,role: user.role  },
          process.env.JWT_SECRET,
          // { expiresIn: "1h" } // Token expires in 1 hour
        );
        // const existingUser = await User.findOne({ email });
        // Use the `set` method to set the values on the instance
        user.set({
          phone_otp : null,
          token: token, // Update the email_otp field
        });
    
        // Save the updated instance back to the database
        await user.save();
    

    return res
      .status(200)
      .json({ success: true, message: "Phone OTP verified successfully.",token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Signin with social media (Google/Facebook)
const signinWithSocial = async (req, res) => {
  const { socialId, email, name, preferred_language, device_token, device_id } =
    req.body;

  // Validate input
  if (!socialId || !email || !name) {
    return res.status(400).json({
      success: false,
      message: "Social ID, email, and name are required.",
    });
  }

  try {
    // Check if the user already exists with the given socialId or email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await User.create({
        name,
        email,
        socialId,
        preferred_language, // Set preferred language if needed
      });
    }

    // Return success and user data (excluding password)
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferred_language: preferred_language || user.preferred_language, // Include provided preferred language or use stored
        device_token, // Include device token
        device_id, // Include device ID
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Generate OTP for email on forget password
const generateEmailOtpForgetPswd = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP to database
    // await User.create({
    //   email,
    //   otp,
    //   expires_at: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
    // });
    const existingUser = await User.findOne({ email });
    // Use the `set` method to set the values on the instance

    // Send OTP via email
    await sendOtpEmail(email, otp);

    existingUser.set({
      email_otp: otp, // Update the email_otp field
    });
    // Save the updated instance back to the database
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Verify OTP  on forget password
const forgetPswdVerifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  try {
    // Check if the OTP exists in the database
    const user = await User.findOne({ email });

    if (!user || user.email_otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check if OTP has expired
    // if (new Date() > otpRecord.expires_at) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "OTP has expired." });
    // }
    if (user.email_otp === otp) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "try after some time",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Update password after OTP verification on forget password
const updatePassword = async (req, res) => {
  const { email, new_password } = req.body;

  // Validate input
  if (!email || !new_password) {
    return res.status(400).json({
      success: false,
      message: "Email, and new password are required.",
    });
  }

  try {
    // Verify OTP first
    const existingUser = await User.findOne({
      email,
    });

    // // Check if OTP has expired
    // if (new Date() > otpRecord.expires_at) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "OTP has expired." });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the password in the User table
    // await User.update({ password: hashedPassword }, { where: { email } });

    // // Optionally, delete the OTP record after use
    // await EmailOtp.destroy({ where: { email } });
    
    existingUser.set({
      password: hashedPassword, // Update the email_otp field
    });
    // Save the updated instance back to the database
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


module.exports = {
  signup,
  signinWithEmailPassword,
  signinWithEmail,
  verifyEmailOtp,
  signinWithPhone,
  verifyPhoneOtp,
  signinWithSocial,
  generateEmailOtpForgetPswd,
  forgetPswdVerifyEmailOtp,
  updatePassword,
};
