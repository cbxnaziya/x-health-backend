const User = require('../models/User');

// Update Language Preference
exports.updateLanguage = async (req, res) => {
  const { userId, language } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { preferredLanguage: language }, { new: true });
    res.status(200).json({ message: 'Language updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
