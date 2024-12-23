const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String, unique: true },
  phone_otp: { type: String }, // store OTP for phone-based signup/signin
  email_otp: { type: String }, // store OTP for password update 
  preferred_language: { type: String, default: "English" },
  device_token: { type: String },
  device_id: { type: String },
  signin_type: { type: String, enum: ["email", "phone", "social"], default: "email" },
  social_id: { type: String }, // store social media user id if using social login
  token: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

