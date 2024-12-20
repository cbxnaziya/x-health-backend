const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  mood: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }, // New is_active field added
});

module.exports = mongoose.model('Mood', MoodSchema);
