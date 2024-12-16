const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferredLanguage: { type: String, default: 'English' },
  mood: { type: String, default: null },
});

module.exports = mongoose.model('User', UserSchema);
