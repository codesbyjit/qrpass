/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader-es6"), { ssr: false });

export default function AdminPage() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Waiting for scan...");
  const [torchOn, setTorchOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const lastScanned = useRef<string | null>(null);
  const cooldown = useRef(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.58:4000";

  const handleScan = useCallback(
    async (data: string | null) => {
      if (!data || cooldown.current) return;
      if (data === lastScanned.current) return;

      cooldown.current = true;
      setTimeout(() => (cooldown.current = false), 1000);

      lastScanned.current = data;
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

  // Handle flashlight toggle
  const toggleTorch = async () => {
    if (!videoTrackRef.current) return;
    try {
      const capabilities = videoTrackRef.current.getCapabilities();
      if ("torch" in capabilities) {
        await videoTrackRef.current.applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn((prev) => !prev);
      } else {
        alert("⚠️ Flashlight not supported on this device");
      }
    } catch (e) {
      console.error("Torch toggle failed:", e);
    }
  };

  // Initialize and force back camera
  useEffect(() => {
    (async () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" }, // force back camera
          },
        });
        setStream(newStream);
        videoTrackRef.current = newStream.getVideoTracks()[0];
      } catch (err) {
        console.warn("Exact facingMode failed, retrying ideal...");
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
          });
          setStream(fallbackStream);
          videoTrackRef.current = fallbackStream.getVideoTracks()[0];
        } catch (e2) {
          console.error("Camera init failed:", e2);
          setStatus("❌ Cannot access camera");
        }
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-5 text-gray-800 text-center">
        🎟️ Event Admin Scanner
      </h1>

      <div className="relative w-80 h-80 bg-white shadow-xl rounded-2xl overflow-hidden flex items-center justify-center border-4 border-gray-300">
        <QrReader
          delay={150}
          onError={handleError}
          onScan={handleScan}
          // @ts-expect-error
          constraints={{
            facingMode: { ideal: "environment" }, // back cam
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute inset-0 border-4 border-green-500 opacity-50 rounded-xl pointer-events-none"></div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={toggleTorch}
          className={`px-4 py-2 rounded-lg shadow transition ${
            torchOn
              ? "bg-yellow-500 text-white"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          {torchOn ? "💡 Torch ON" : "💡 Torch OFF"}
        </button>
      </div>

      <p className="mt-5 text-lg font-medium text-gray-700 break-all text-center">
        {result ? `QR Data: ${result}` : "📷 Scan a QR to verify"}
      </p>

      <p
        className={`mt-3 px-5 py-2 rounded-xl text-center transition-all duration-300 ${
          status.includes("Verified")
            ? "bg-green-100 text-green-700"
            : status.includes("Error") || status.includes("Cannot")
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </p>
    </div>
  );
}
