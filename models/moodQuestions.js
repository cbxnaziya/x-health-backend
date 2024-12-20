const mongoose = require("mongoose");

const MoodQuestionnaireSchema = new mongoose.Schema({
  mood: { type: String, required: true, unique: true }, // Mood category (e.g., happy, sad)
  questions: { type: [String], required: true }, // Array of questions for the mood
});

const MoodQuestionnaire = mongoose.model("MoodQuestionnaire", MoodQuestionnaireSchema);

module.exports = MoodQuestionnaire;
