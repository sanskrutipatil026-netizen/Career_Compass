const express = require("express");

const router = express.Router();

const ResumeAnalysis =
  require("../models/ResumeAnalysis");

router.post("/save", async (req, res) => {
  try {
    console.log(
      "📥 Resume analysis save request received"
    );

    const {
      fileName,
      fileType,
      fileSize,
      extractedText,
      analysis,
    } = req.body;

    if (!analysis) {
      console.log(
        "❌ Analysis data is missing"
      );

      return res.status(400).json({
        success: false,
        message:
          "Resume analysis data is required.",
      });
    }

    console.log(
      "📄 File:",
      fileName
    );

    console.log(
      "📊 Analysis received"
    );

    console.log(
      "📊 Overall Score:",
      analysis.overallScore
    );

    const resumeAnalysis =
      new ResumeAnalysis({
        resume: {
          fileName:
            fileName || "",

          fileType:
            fileType || "",

          fileSize:
            Number(fileSize) || 0,

          extractedText:
            extractedText || "",
        },

        analysis: analysis,
      });

    console.log(
      "💾 Attempting MongoDB save..."
    );

    const savedResume =
      await resumeAnalysis.save();

    console.log(
      "✅ Resume analysis saved to MongoDB:",
      savedResume._id
    );

    return res.status(201).json({
      success: true,

      message:
        "Resume analysis saved successfully.",

      resumeAnalysis:
        savedResume,
    });

  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "❌ SAVE RESUME ANALYSIS ERROR"
    );

    console.error(
      "Error name:",
      error?.name
    );

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Full error:",
      error
    );

    if (error?.errors) {
      console.error(
        "MONGOOSE VALIDATION ERRORS:"
      );

      Object.keys(error.errors).forEach(
        (key) => {
          console.error(
            key,
            ":",
            error.errors[key]?.message
          );
        }
      );
    }

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to save resume analysis.",

      error:
        error instanceof Error
          ? error.message
          : String(error),

      errorName:
        error?.name || "UnknownError",

      validationErrors:
        error?.errors
          ? Object.keys(error.errors).map(
              (key) => ({
                field: key,
                message:
                  error.errors[key]?.message,
              })
            )
          : [],
    });
  }
});

router.get("/latest", async (req, res) => {
  try {
    console.log(
      "📤 Latest resume analysis requested"
    );

    const resumeAnalysis =
      await ResumeAnalysis
        .findOne()
        .sort({
          createdAt: -1,
        });

    if (!resumeAnalysis) {
      return res.status(404).json({
        success: false,

        message:
          "No resume analysis found.",
      });
    }

    console.log(
      "✅ Latest resume analysis found:",
      resumeAnalysis._id
    );

    return res.status(200).json({
      success: true,

      resumeAnalysis:
        resumeAnalysis,
    });

  } catch (error) {
    console.error(
      "❌ GET RESUME ANALYSIS ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch resume analysis.",

      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Resume analysis route is working.",
  });
});

module.exports = router;

