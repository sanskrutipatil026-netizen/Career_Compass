const express = require("express");

const router = express.Router();

const Interview = require("../models/Interview");

// ==========================================================
// SAVE COMPLETE INTERVIEW
// POST /api/interview/save
// ==========================================================

router.post("/save", async (req, res) => {
  try {
    const {
      resumeScore,
      questions,
      totalScore,
      totalQuestions,
      answered,
      skipped,
      difficulty,
      time,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be an array.",
      });
    }

    // --------------------------------------------------------
    // CREATE INTERVIEW DOCUMENT
    // --------------------------------------------------------

    const interview = new Interview({
      resumeScore: Number(resumeScore) || 0,

      questions: questions.map((q) => ({
        question: q.question || "",
        answer: q.answer || "",
        topic: q.topic || "Resume",
        difficulty:
          q.difficulty ||
          difficulty ||
          "easy",
        score: Number(q.score) || 0,
        feedback: q.feedback || "",
        status:
          q.status || "Answered",
      })),

      totalScore:
        Number(totalScore) || 0,

      totalQuestions:
        Number(totalQuestions) ||
        questions.length,

      answered:
        Number(answered) || 0,

      skipped:
        Number(skipped) || 0,

      difficulty:
        difficulty || "easy",

      time:
        time || "00:00",
    });

    // --------------------------------------------------------
    // SAVE TO MONGODB
    // --------------------------------------------------------

    const savedInterview =
      await interview.save();

    console.log(
      "✅ Interview saved to MongoDB:",
      savedInterview._id
    );

    return res.status(201).json({
      success: true,
      message:
        "Interview saved successfully.",
      interview: savedInterview,
    });

  } catch (error) {
    console.error(
      "❌ SAVE INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to save interview.",
      error: error.message,
    });
  }
});

// ==========================================================
// GET ALL INTERVIEW HISTORY
// GET /api/interview/history
// ==========================================================

router.get("/history", async (req, res) => {
  try {
    const interviews =
      await Interview.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error(
      "❌ GET INTERVIEW HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview history.",
      error: error.message,
    });
  }
});

// ==========================================================
// GET LATEST INTERVIEW
// GET /api/interview/latest
// ==========================================================

router.get("/latest", async (req, res) => {
  try {
    const interview =
      await Interview.findOne()
        .sort({
          createdAt: -1,
        });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "No interview found.",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error(
      "❌ GET LATEST INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch latest interview.",
      error: error.message,
    });
  }
});

// ==========================================================
// DELETE INTERVIEW
// DELETE /api/interview/:id
// ==========================================================

router.delete("/:id", async (req, res) => {
  try {
    const deletedInterview =
      await Interview.findByIdAndDelete(
        req.params.id
      );

    if (!deletedInterview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    console.log(
      "🗑 Interview deleted from MongoDB:",
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Interview deleted successfully.",
    });

  } catch (error) {
    console.error(
      "❌ DELETE INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete interview.",
      error: error.message,
    });
  }
});

// ==========================================================
// TEST ROUTE
// GET /api/interview/test
// ==========================================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Interview route is working.",
  });
});

// ==========================================================
// EXPORT
// ==========================================================

module.exports = router;