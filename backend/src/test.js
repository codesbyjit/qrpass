import { generateOptimizedQR } from "./utils/qr.js";

const test = async () => {
  console.time("QR-Gen-Time");
  const filepath = await generateOptimizedQR("Hello, Jit! 🚀");
  console.timeEnd("QR-Gen-Time");
  console.log("✅ QR saved at:", filepath);
};

test();