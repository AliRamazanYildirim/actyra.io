// app/not-found.js
"use client";

import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0E25] text-white px-6 pt-24 pb-16 text-center space-y-8">
      {/* ↑ pt-24 sorgt für Abstand zur Navigation */}

      {/* Logo oben */}
      <Image
        src="/logo-actyra.png"
        alt="Actyra Logo"
        width={90}
        height={90}
        className="rounded-lg shadow-md hover:scale-105 transition duration-300"
        priority
      />

      {/* Großes 404 */}
      <h1 className="text-6xl md:text-8xl font-extrabold text-pink-500">
        404
      </h1>

      {/* Beschreibung */}
      <h2 className="text-2xl md:text-3xl font-semibold text-white">
        Leider ist die gewünschte Seite nicht vorhanden.
      </h2>

      {/* Animiertes Bild mit Parallax-Tilt */}
      <Tilt
        glareEnable={false}
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        perspective={1000}
        transitionSpeed={2500}
        scale={1.05}
        className="w-full max-w-xs md:max-w-md mx-auto"
      >
        <Image
          src="/herobanner_event.png"
          alt="404 Bild"
          width={400}
          height={400}
          className="rounded-xl shadow-2xl opacity-90 backdrop-blur-sm"
          priority
        />
      </Tilt>

      {/* Zurück-Button */}
      <Link href="/">
        <button className="mt-6 px-6 py-3 font-semibold rounded bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 transition">
          Zur Startseite
        </button>
      </Link>
    </div>
  );
}
