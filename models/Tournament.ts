import mongoose from "mongoose"

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: Number,
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Tournament || mongoose.model("Tournament", TournamentSchema)
