import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { Student } from "@/app/lib/models/student";
import { User } from "@/app/lib/models/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required to save student details." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Connect to database
    await connectToDatabase();

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

    const student = await Student.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: studentData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        message: "Student details saved successfully in database!",
        student,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Student save error:", error);
    return NextResponse.json(
      { message: "Failed to save student details", error: error.message },
      { status: 500 }
    );
  }
}
