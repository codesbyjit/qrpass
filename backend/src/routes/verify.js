import express from "express";
const router = express.Router();

// ✅ Static ticket data (for now, can come from DB later)
const data = new Set([
  "241013005005",
  "241013005006",
  "241013005007",
  "241013005008",
  "241013005009",
  "241013005010",
]);

router.post("/", async (req, res) => {
  try {
    const { ticketId } = req.body;
    console.log("🎟️ Scanned Ticket ID:", ticketId);

    // ✅ Basic validation
    if (!ticketId) {
      return res.status(400).json({ message: "❌ No ticket ID provided." });
    }

    // ✅ Ultra-fast lookup using Set (O(1) time complexity)
    if (data.has(ticketId.toString())) {
      console.log(`✅ Ticket ${ticketId} verified.`);
      return res.json({ message: `✅ Ticket ${ticketId} is valid.` });
    }

    console.log(`❌ Ticket ${ticketId} invalid.`);
    return res.json({ message: `❌ Ticket ${ticketId} is invalid.` });
  } catch (err) {
    console.error("Error verifying ticket:", err);
    res.status(500).json({ message: "⚠️ Internal server error." });
  }
});

export default router;