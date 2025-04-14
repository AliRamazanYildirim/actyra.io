"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ModalVideo({ setShowVideo }) {
  const videoRef = useRef(null);

  // Autoplay beim Öffnen
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center px-4">
      {/* Inhalt des Modals */}
      <div className="relative w-full max-w-3xl">
        {/* Logo oben links im Modal */}
        <Image
          src="/logo-actyra.png"
          alt="Actyra Logo"
          width={50}
          height={50}
          className="absolute top-4 left-4 rounded shadow-md"
        />

        {/* Video selbst */}
        <video
          ref={videoRef}
          controls
          className="w-full rounded-xl shadow-lg"
          src="/actyra_intro.mp4"
        />

        {/* Schließen-Button */}
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
          aria-label="Schließen"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
