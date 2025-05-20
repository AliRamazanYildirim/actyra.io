'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 100); // 100–200ms Verzögerung
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#18123c] to-[#1a1441]">
      <div className="flex flex-col items-center space-y-6">
        {/* Sichtbar rotierender, leuchtender Rahmen */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rotierender Ring mit Farbverlauf */}
          <div
            className="absolute inset-0 rounded-full p-[4px] animate-spin"
            style={{
              background: "conic-gradient(from 0deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)",
              maskImage: "linear-gradient(white, white)",
              WebkitMaskImage: "linear-gradient(white, white)",
              boxShadow: "0 0 25px rgba(236, 72, 153, 0.7)",
            }}
          />

          {/* Weißer Innenkreis (ruhig) */}
          <div className="absolute w-28 h-28 rounded-full bg-white z-10" />

          {/* Das unbewegte Actyra-Logo */}
          <div className="relative z-20 w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/logo-actyra.png"
              alt="Actyra Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>

        {/* Lade-Text */}
        <p className="text-lg text-white/80 tracking-wide mt-2">
          Lade <span className="text-pink-400 font-semibold">Actyra</span>…
        </p>
      </div>
    </div>
  );
}
