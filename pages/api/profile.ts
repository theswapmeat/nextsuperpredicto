import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserType } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { email } = req.method === "GET" ? req.query : req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (req.method === "GET") {
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const typedUser = user as unknown as UserType;

    return res.json({
      firstName: typedUser.firstName || "",
      lastName: typedUser.lastName || "",
      username: typedUser.username || "",
      email: typedUser.email,
    });
  }

  if (req.method === "POST") {
    const { firstName, lastName, username } = req.body;

    // ✅ Basic Validation
    if (
      !firstName ||
      typeof firstName !== "string" ||
      firstName.trim().length < 2 ||
      !lastName ||
      typeof lastName !== "string" ||
      lastName.trim().length < 2 ||
      !username ||
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      return res.status(400).json({
        error: "Please provide valid first name, last name, and username.",
      });
    }

    await User.updateOne(
      { email },
      {
        $set: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim().toLowerCase(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  }

  return res.status(405).end();
}
