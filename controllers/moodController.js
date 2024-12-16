const Mood = require('../models/Mood');

// Save Mood
exports.saveMood = async (req, res) => {
  const { userId, mood } = req.body;
  try {
    const newMood = await Mood.create({ userId, mood });
    res.status(201).json({ message: 'Mood saved successfully', mood: newMood });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
