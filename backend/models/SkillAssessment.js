const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      default: "Fresher",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillAssessment",
  skillAssessmentSchema
);
