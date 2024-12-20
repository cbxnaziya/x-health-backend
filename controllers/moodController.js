// const Mood = require('../models/Mood');

// // Save Mood
// exports.saveMood = async (req, res) => {
//   const { userId, mood } = req.body;
//   try {
//     const newMood = await Mood.create({ userId, mood });
//     res.status(201).json({ message: 'Mood saved successfully', mood: newMood });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const Mood = require('../models/Mood');

// Controller to handle saving a new mood
const saveMood = async (req, res) => {
  try {
    const { mood } = req.body;

    // Validate request
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required.' });
    }

    // Create and save the new mood
    const newMood = new Mood({ mood, is_active: true });
    await newMood.save();

    res.status(201).json({ message: 'Mood saved successfully!', mood: newMood });
  } catch (error) {
    res.status(500).json({ message: 'Error saving mood.', error: error.message });
  }
};

// Controller to handle retrieving all moods
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find();
    res.status(200).json({ moods });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving moods.', error: error.message });
  }
};

// Controller to handle updating a mood
const updateMood = async (req, res) => {
  try {
    const { id, mood, is_active } = req.body;

    // Validate request
    if (!id || (!mood && is_active === undefined)) {
      return res.status(400).json({ message: 'Mood ID and fields to update are required.' });
    }

    // Find the mood and update
    const updatedMood = await Mood.findByIdAndUpdate(
      id,
      { ...(mood && { mood }), ...(is_active !== undefined && { is_active }) },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood not found.' });
    }

    res.status(200).json({ message: 'Mood updated successfully!', mood: updatedMood });
  } catch (error) {
    res.status(500).json({ message: 'Error updating mood.', error: error.message });
  }
};

// Controller to handle deleting a mood
const deleteMood = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate request
    if (!id) {
      return res.status(400).json({ message: 'Mood ID is required.' });
    }

    // Find and delete the mood
    const deletedMood = await Mood.findByIdAndDelete(id);

    if (!deletedMood) {
      return res.status(404).json({ message: 'Mood not found.' });
    }

    res.status(200).json({ message: 'Mood deleted successfully!', mood: deletedMood });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mood.', error: error.message });
  }
};

module.exports = {
  saveMood,
  getMoods,
  updateMood,
  deleteMood,
};
