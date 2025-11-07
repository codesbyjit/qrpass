"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader-es6"), { ssr: false });

export default function AdminPage() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Waiting for scan...");
  const [torchOn, setTorchOn] = useState(false);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.58:4000";

  const handleScan = useCallback(
    async (data: string | null) => {
      if (!data) return;
      setResult(data);
      setStatus("Verifying...");

      try {
        const res = await fetch(`${API_URL}/api/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: data }),
        });
        const json = await res.json();
        setStatus(json.message || "✅ Verified");
      } catch (err) {
        console.error(err);
        setStatus("❌ Error verifying ticket");
      }
    },
    [API_URL]
  );

  const handleError = useCallback((err: any) => {
    console.error(err);
    setStatus("⚠️ Camera error. Try again.");
  }, []);

  // Torch toggle
  const toggleTorch = async () => {
    try {
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities();
        if ("torch" in capabilities) {
          await videoTrack.applyConstraints({ advanced: [{ torch: !torchOn }] });
          setTorchOn((t) => !t);
        } else alert("⚠️ Flashlight not supported on this camera.");
      }
    } catch (err) {
      console.error("Torch error:", err);
    }
  };

  const handleStream = useCallback((stream: MediaStream) => {
    const track = stream.getVideoTracks()[0];
    setVideoTrack(track);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-5 text-gray-800">🎟️ Event Admin Scanner</h1>

      <div className="relative w-80 h-80 bg-white shadow-xl rounded-2xl overflow-hidden border-4 border-gray-300">
        <QrReader
          delay={200}
          onError={handleError}
          onScan={handleScan}
          // ✅ Force back camera
          constraints={{
            // video: { facingMode: { exact: "environment" } },
            facingMode: { ideal: "environment" },
          }}
          onLoad={handleStream}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute inset-0 border-4 border-green-500 opacity-50 rounded-xl pointer-events-none"></div>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        <button
          onClick={toggleTorch}
          className={`px-4 py-2 rounded-lg shadow transition ${
            torchOn ? "bg-yellow-500 text-white" : "bg-gray-700 text-white"
          }`}
        >
          💡 {torchOn ? "Torch ON" : "Torch OFF"}
        </button>
      </div>

      <p className="mt-5 text-lg font-medium text-gray-700 break-all text-center">
        {result ? `QR Data: ${result}` : "📷 Scan a QR to verify"}
      </p>

      <p
        className={`mt-3 px-5 py-2 rounded-xl text-center transition-all duration-300 ${
          status.includes("Verified")
            ? "bg-green-100 text-green-700"
            : status.includes("Error") || status.includes("Please")
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </p>
    </div>
  );
}
