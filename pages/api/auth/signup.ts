import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username must be 3–15 characters and contain only letters or numbers",
    });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    console.log("[Signup] Incoming body:", req.body)
    
    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("[Signup Error]", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
