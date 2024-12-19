const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  nickname: { type: String },
  religion: { type: String },
  mood: { type: String },
  religious: { type: Boolean },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', ProfileSchema);
