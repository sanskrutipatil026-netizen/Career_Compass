import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/lib/models/user";
import { Student } from "@/app/lib/models/student";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Connect to database
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email is already registered." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Create initial student record
    try {
      await Student.findOneAndUpdate(
        { email: normalizedEmail },
        {
          $set: {
            fullName: name.trim(),
            email: normalizedEmail,
            userId: newUser._id,
          },
        },
        { upsert: true, new: true }
      );
    } catch (studentErr) {
      console.warn("Notice: student initial record creation:", studentErr);
    }

    return NextResponse.json(
      {
        message: "Account created successfully!",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: "Failed to create account", error: error.message },
      { status: 500 }
    );
  }
}
