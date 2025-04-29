// 📁 src/components/HeroComp.jsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Stars from "./DynamicStars";
import { useEffect, useState } from "react";
import { Play, Heart } from "lucide-react";
import ModalVideo from "./ModalVideo";

// Wörter für animierte Laufschrift
const WORDS = [
  "und Spende!",
  "mit Herz",
  "mit Wirkung!",
  "mit Sinn!",
  "mit Mehrwert!",
  "mit Menschlichkeit",
  "Unvergesslich!",
];

export default function HeroComp() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[index];
    if (letterIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[letterIndex]);
        setLetterIndex(letterIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setDisplayedText("");
        setLetterIndex(0);
        setIndex((prev) => (prev + 1) % WORDS.length);
      }, 2000);
      return () => clearTimeout(pause);
    }
  }, [letterIndex, index]);

  return (
    <header id="home" className="relative overflow-hidden bg-[#0D0E25] text-white">
      <Stars />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-40 pb-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="space-y-6 text-center md:text-left">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
              Finde dein nächstes Social Event&nbsp;
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                {displayedText}
              </span>
            </h1>

            <div className="flex flex-col items-center md:items-start text-white gap-2">
              <p className="flex items-center text-base font-bold">
                <Heart size={18} className="mr-2 text-pink-500 animate-pulse" />
                Actyra macht dein Ticket zum guten Zweck:
              </p>

              <div className="h-2" />

              <p className="text-base">
                Buche <strong>Konzerte, Kultur- oder Freizeitevents</strong> – ein Teil des Ticketpreises wird <strong>automatisch gespendet</strong>.
              </p>
              <p className="text-base">
                Du entscheidest, <strong>welche Organisation</strong> du unterstützen willst.
              </p>
              <p className="text-base">
                <strong>Erleben & helfen</strong> war noch nie so einfach.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="px-6 py-3 font-semibold rounded bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 transition cursor-pointer">
                Jetzt entdecken
              </button>
              <button className="px-6 py-3 font-semibold rounded border border-pink-500 text-pink-400 hover:bg-pink-600 hover:text-white transition cursor-pointer">
                Event erstellen
              </button>
            </div>
          </motion.div>
        </div>

        <Tilt
          glareEnable={false}
          perspective={1000}
          scale={1.05}
          transitionSpeed={2500}
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          className="flex justify-center relative"
        >
          <Image
            src="/herobanner_event.png"
            alt="Event Vorschau"
            width={400}
            height={400}
            className="rounded-xl shadow-2xl opacity-90 backdrop-blur-sm"
            priority
          />
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

      {showVideo && <ModalVideo setShowVideo={setShowVideo} />}
    </header>
  );
}
