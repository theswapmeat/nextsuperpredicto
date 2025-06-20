import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  is_paid: { type: Boolean, default: false },
  amount: Number,
  paid_at: Date,
  method: String, // e.g., "bank_transfer", "paypal"
})

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
