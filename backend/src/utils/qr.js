import QRCode from "qrcode";

/**
 * Generate a scannable, optimized QR code as Base64 PNG.
 * @param {string} text - Data to encode in the QR.
 * @returns {Promise<string>} - Base64 data URL (embeddable in HTML).
 */
export const generateOptimizedQR = async (text) => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      type: "image/png",
      width: 256,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return dataUrl; // directly usable in email img tag
  } catch (err) {
    console.error("QR generation failed:", err);
    throw err;
  }
};
