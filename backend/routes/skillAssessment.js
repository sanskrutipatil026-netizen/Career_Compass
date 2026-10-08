const express = require("express");
const router = express.Router();

const SkillAssessment = require("../models/SkillAssessment");

// ==========================================================
// SAVE SKILL ASSESSMENT
// ==========================================================

router.post("/save", async (req, res) => {
  try {
    const {
      score,
      percentage,
      totalQuestions,
      skills,
      experienceLevel,
      date,
    } = req.body;

    console.log("RECEIVED ASSESSMENT:", req.body);

    // Validate required fields
    if (
      score === undefined ||
      percentage === undefined ||
      totalQuestions === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Score, percentage and totalQuestions are required.",
      });
    }

    const assessment = await SkillAssessment.create({
      score,
      percentage,
      totalQuestions,
      skills: Array.isArray(skills) ? skills : [],
      experienceLevel: experienceLevel || "Fresher",
      date: date || new Date(),
    });

    console.log(
      "ASSESSMENT SAVED:",
      assessment
    );

    return res.status(201).json({
      success: true,
      message: "Assessment score saved successfully",
      assessment,
    });
  } catch (error) {
    console.error(
      "SAVE ASSESSMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to save assessment",
    });
  }
});

// ==========================================================
// GET LATEST SKILL ASSESSMENT
// ==========================================================

router.get("/latest", async (req, res) => {
  try {
    const assessment = await SkillAssessment
      .findOne()
      .sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: "No skill assessment found",
      });
    }

    console.log(
      "LATEST ASSESSMENT:",
      assessment
    );

    return res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error(
      "GET LATEST ASSESSMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to fetch assessment",
    });
  }
});

module.exports = router;

