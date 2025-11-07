import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import os from "os";
import { connectDB } from "./config/db.js";
import registerRoute from "./routes/register.js";
import verifyRoute from "./routes/verify.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup – allow all for local/network testing
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON parser
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/register", registerRoute);
app.use("/api/verify", verifyRoute);

// ✅ Start server on all interfaces (local + network)
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  const networkInterfaces = os.networkInterfaces();
  const localIP =
    Object.values(networkInterfaces)
      .flat()
      .find((iface) => iface.family === "IPv4" && !iface.internal)?.address || "localhost";

  console.log("🚀 Server is running:");
  console.log(`➡️  Local:   http://localhost:${PORT}`);
  console.log(`➡️  Network: http://${localIP}:${PORT}`);
});
