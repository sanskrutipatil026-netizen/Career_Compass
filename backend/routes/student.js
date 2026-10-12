const express = require("express");
const Student = require("../models/student");
const User = require("../models/user");

const router = express.Router();

// ==========================================
// SAVE OR UPDATE STUDENT PERSONAL DETAILS
// ==========================================
router.post("/save", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      city,
      collegeName,
      branch,
      cgpa,
      yearsOfExperience,
      skills,
      targetRole,
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to save student details." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if matching user exists in User collection
    const user = await User.findOne({ email: normalizedEmail });

    const studentData = {
      fullName: fullName || (user ? user.name : "Student"),
      email: normalizedEmail,
      phoneNumber: phoneNumber || "",
      city: city || "",
      collegeName: collegeName || "",
      branch: branch || "",
      cgpa: cgpa || "",
      yearsOfExperience: yearsOfExperience || "0",
      skills: Array.isArray(skills) ? skills : [],
      targetRole: targetRole || "Software Engineer",
      userId: user ? user._id : undefined,
    };

    // Upsert: update existing student or create new one
    const student = await Student.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: studentData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Student details saved successfully in database!",
      student,
    });
  } catch (error) {
    console.error("Save student error:", error);
    res.status(500).json({ message: "Failed to save student details in database", error: error.message });
  }
});

// ==========================================
// GET STUDENT DETAILS BY EMAIL
// ==========================================
router.get("/details/:email", async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student record not found." });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ message: "Error fetching student details", error: error.message });
  }
});

// ==========================================
// GET ALL REGISTERED STUDENTS
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ count: students.length, students });
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
});

module.exports = router;
