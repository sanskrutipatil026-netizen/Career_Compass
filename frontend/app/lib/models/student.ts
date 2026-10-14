import mongoose, { Schema, model, models } from "mongoose";

const StudentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    collegeName: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    cgpa: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: String,
      default: "0",
    },
    skills: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      default: "Software Engineer",
    },
  },
  { timestamps: true }
);

export const Student = models.Student || model("Student", StudentSchema);
