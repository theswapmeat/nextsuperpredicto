import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Tournament from "@/models/Tournament";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserType } from "@/types/user";
import type { TournamentType } from "@/types/tournament";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Missing or invalid email" });
    }

    const rawUser = await User.findOne({ email }).lean();

    // ✅ If user not found, return 404
    if (!rawUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ If no tournaments, return empty array with 200 OK
    const user = rawUser as unknown as UserType;
    if (!Array.isArray(user.tournaments) || user.tournaments.length === 0) {
      return res.status(200).json([]);
    }

    const tournamentObjectIds = user.tournaments.map(
      (t) => new Types.ObjectId(t.tournamentId)
    );

    const tournaments = (await Tournament.find({
      _id: { $in: tournamentObjectIds },
    }).lean()) as unknown as TournamentType[];

    const cleaned = tournaments.map((t) => ({
      _id: t._id?.toString?.() ?? "",
      name: t.name,
      year: t.year,
    }));

    return res.status(200).json(cleaned);
  } catch (err) {
    console.error("Failed to fetch tournaments:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
