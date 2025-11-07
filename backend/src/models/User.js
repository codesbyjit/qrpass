import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: String,
  qrCode: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);