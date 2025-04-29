"use client";

import Image from "next/image";
import { useState } from "react";
import ModalVideo from "./ModalVideo";
import { Play } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function HeroEventErstellen() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#0D0E25] to-[#1C1F3C] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        
        {/* Textblock */}
        <div className="space-y-6 text-center md:text-left">
          <div className="space-y-4 mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug">
              Event erstellen und verkaufen
            </h1>
            <p className="text-base sm:text-lg">
              Verkaufen Sie Ihr Event mit Actyra!
            </p>
            <p className="text-base sm:text-lg">
              Erreichen Sie Ihr Publikum – und unterstützen Sie Projekte, die Gutes bewirken.
            </p>
          </div>
        </div>

        {/* Video mit Play-Button */}
        <Tilt
          glareEnable={false}
          perspective={1000}
          scale={1.05}
          transitionSpeed={2500}
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          className="flex justify-center relative"
        >
          {/* Vorschau-Bild */}
          <Image
            src="/bild2.png"
            alt="Event Vorschau"
            width={400}
            height={400}
            className="rounded-xl shadow-2xl opacity-90 backdrop-blur-sm"
            priority
          />

          {/* Play Button über Bild */}
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex flex-col items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <div className="backdrop-blur-md bg-black/30 rounded-full p-4 shadow-lg border border-white">
              <Play className="w-8 h-8 text-red-500" />
            </div>
            <span className="text-white mt-2 text-sm sm:text-base font-semibold drop-shadow">
              Video ansehen
            </span>
          </button>
        </Tilt>
      </div>

      {/* Video Modal */}
      {showVideo && <ModalVideo setShowVideo={setShowVideo} />}
    </header>
  );
}
