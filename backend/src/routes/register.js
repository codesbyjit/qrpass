import express from "express";
import { User } from "../models/User.js";
import { generateOptimizedQR } from "../utils/qr.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, userId, eventName, location, date, time } = req.body;

    if (!name || !email || !userId || !eventName || !location || !date || !time)
      return res.status(400).json({ message: "All fields are required" });

    // Create QR data (unique per user)
    const qrData = `${userId}`;
    const qrImage = await generateOptimizedQR(qrData);

    // Save user data (optional)
    const user = new User({ name, email, userId });
    await user.save();

    // Send email
    await sendMail(email, qrImage, { name, eventName, location, date, time });
    console.log(`✅ Invitation sent to: ${email}`);

    res.json({ message: "Registered successfully! Invitation sent via email." });
  } catch (err) {
    console.error("❌ Registration failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
