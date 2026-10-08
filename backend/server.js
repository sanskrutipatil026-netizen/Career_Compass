const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require("dns");

dotenv.config();

// ==========================================================
// USE GOOGLE DNS FOR MONGODB ATLAS CONNECTION
// ==========================================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================================================
// CREATE EXPRESS APP
// ==========================================================

const app = express();

// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

// ==========================================================
// AUTHENTICATION ROUTES
// ==========================================================

app.use(
  "/api/auth",
  require("./routes/auth")
);

// ==========================================================
// SKILL ASSESSMENT ROUTES
// ==========================================================

const skillAssessmentRoutes =
  require("./routes/skillAssessment");

app.use(
  "/api/skill-assessment",
  skillAssessmentRoutes
);

// ==========================================================
// INTERVIEW ROUTES
// ==========================================================

const interviewRoutes =
  require("./routes/interview");

app.use(
  "/api/interview",
  interviewRoutes
);

// ==========================================================
// RESUME ANALYSIS ROUTES
// ==========================================================

const resumeAnalysisRoutes =
  require("./routes/resumeAnalysis");

app.use(
  "/api/resume-analysis",
  resumeAnalysisRoutes
);

// ==========================================================
// MONGODB CONNECTION
// ==========================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      "✅ MongoDB Connected Successfully"
    );
  })
  .catch((err) => {
    console.log(
      "❌ MongoDB Connection Error"
    );

    console.log(err);
  });

// ==========================================================
// TEST ROUTE
// ==========================================================

app.get("/", (req, res) => {
  res.send(
    "Backend server is running"
  );
});

// ==========================================================
// SERVER
// ==========================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});