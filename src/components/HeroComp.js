"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";
import { Play, Heart, Sparkles, CalendarPlus } from "lucide-react";
import ModalVideo from "./ModalVideo";
import { useRouter, usePathname } from "next/navigation";

// Wörter für animierte Laufschrift (kompakt & passend für 2-Zeilen-Layout)
const WORDS = [
  "Unvergesslich!",
  "mit Herz ❤️",
  "mit Wirkung!",
  "mit Sinn!",
  "mit Mehrwert!",
  "und Spende!",
];

export default function HeroComp() {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const handleScrollTo = (id) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const currentWord = WORDS[index];
    if (letterIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[letterIndex]);
        setLetterIndex(letterIndex + 1);
      }, 90);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setDisplayedText("");
        setLetterIndex(0);
        setIndex((prev) => (prev + 1) % WORDS.length);
      }, 2200);
      return () => clearTimeout(pause);
    }
  }, [letterIndex, index]);

  return (
    <header id="home" className="relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-36 pb-16 grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-10 items-center">
        {/* Sol Alan: Başlık, Açıklama ve Butonlar */}
        <div className="space-y-6 text-center md:text-left">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {/* 2 Satırda Sabit Kalan, Zıplamayan Başlık */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight">
              Finde dein nächstes Social Event&nbsp;
              <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                {displayedText}
                <span className="text-pink-500 font-normal animate-pulse">
                  |
                </span>
              </span>
            </h1>

            {/* Bilgilendirme Metinleri */}
            <div className="flex flex-col items-center md:items-start gap-2 text-slate-700 dark:text-slate-300">
              <p className="flex items-center text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                <Heart
                  size={18}
                  className="mr-2 text-pink-500 animate-pulse fill-pink-500/20"
                />
                Actyra macht dein Ticket zum guten Zweck:
              </p>

              <div className="h-1" />

              <p className="text-sm sm:text-base leading-relaxed">
                Buche <strong>Konzerte, Kultur- oder Freizeitevents</strong> –
                ein Teil des Ticketpreises wird{" "}
                <strong>automatisch gespendet</strong>.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                Du entscheidest, <strong>welche Organisation</strong> du
                unterstützen willst.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-200">
                <strong>Erleben & helfen</strong> war noch nie so einfach.
              </p>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-3">
              <button
                onClick={() => handleScrollTo("events")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Jetzt entdecken</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                onClick={() => router.push("/event-erstellen")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border border-slate-300 dark:border-slate-700 hover:border-pink-500/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:text-pink-500 dark:hover:text-pink-400 shadow-sm transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Event erstellen</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Sağ Alan: Orijinal Net Video Kartı (Flursuz & Canlı) */}
        <div className="flex justify-center">
          <Tilt
            glareEnable={false}
            perspective={1000}
            scale={1.03}
            transitionSpeed={2500}
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            className="w-full max-w-md relative group cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/herobanner_event.png"
                alt="Actyra Social Events"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex flex-col items-center justify-center hover:scale-105 transition-all cursor-pointer"
                aria-label="Video ansehen"
              >
                <div className="backdrop-blur-md bg-black/40 rounded-full p-4 shadow-xl border border-white/80">
                  <Play className="w-8 h-8 text-red-500 fill-red-500 ml-0.5" />
                </div>
                <span className="text-white mt-2.5 text-sm sm:text-base font-semibold drop-shadow-md">
                  Video ansehen
                </span>
              </button>
            </div>
          </Tilt>
        </div>
      </div>

      {showVideo && <ModalVideo setShowVideo={setShowVideo} />}
    </header>
  );
}
