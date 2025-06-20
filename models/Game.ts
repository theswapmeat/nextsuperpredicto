import mongoose from "mongoose"

const GameSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  home_team: String,
  away_team: String,
  date_of_game: Date,
  home_score: Number,
  away_score: Number,
  is_completed: { type: Boolean, default: false },
})

export default mongoose.models.Game || mongoose.model("Game", GameSchema)
