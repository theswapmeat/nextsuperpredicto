import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserType } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    const { email } = req.method === "GET" ? req.query : req.body;
    if (!email || typeof email !== "string") {
      console.error("[profile] Invalid email:", email);
      return res.status(400).json({ error: "Invalid email" });
    }

    // -------------------------------
    // GET: Fetch user profile
    // -------------------------------
    if (req.method === "GET") {
      const user = (await User.findOne({ email }).lean()) as UserType | null;

      if (!user) {
        console.warn("[profile] User not found for:", email);
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email,
      });
    }

    // -------------------------------
    // POST: Update user profile
    // -------------------------------
    if (req.method === "POST") {
      const { firstName, lastName, username } = req.body;

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
        return res
          .status(400)
          .json({ error: "Please provide valid profile information." });
      }

      const trimmedUsername = username.trim().toLowerCase();

      const existing = await User.findOne({
        username: trimmedUsername,
        email: { $ne: email },
      });

      if (existing) {
        return res
          .status(400)
          .json({ error: "That username is already taken." });
      }

      await User.updateOne(
        { email },
        {
          $set: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: trimmedUsername,
          },
        }
      );

      return res.status(200).json({ success: true });
    }

    // -------------------------------
    // Unsupported method
    // -------------------------------
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[profile] Unhandled server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
