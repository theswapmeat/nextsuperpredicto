import mongoose from "mongoose"

const UserPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  predicted_home_score: { type: Number, required: true },
  predicted_away_score: { type: Number, required: true },
  points_awarded: { type: Number, default: 0 },
  scoring_completed: { type: Boolean, default: false }, // ✅ Added for v2.0
})

export default mongoose.models.UserPrediction || mongoose.model("UserPrediction", UserPredictionSchema)
