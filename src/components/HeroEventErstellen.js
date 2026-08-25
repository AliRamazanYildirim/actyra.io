"use client";

import Image from "next/image";
import { useState } from "react";
import ModalVideo from "./ModalVideo";
import Stars from "./Stars";
import { Play, Sparkles, Zap, HeartHandshake, ShieldCheck } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

export default function HeroEventErstellen() {
  const [showVideo, setShowVideo] = useState(false);

  const benefits = [
    {
      icon: Zap,
      title: "In unter 2 Minuten live",
      desc: "Einfaches Formular, sofortige Freischaltung und Live-Verkauf.",
    },
    {
      icon: HeartHandshake,
      title: "Integrierter Social Impact",
      desc: "Ein Teil jedes Ticketpreises geht automatisch an den guten Zweck.",
    },
    {
      icon: ShieldCheck,
      title: "Sichere Ticketabwicklung",
      desc: "Automatisierte QR-Codes, Stripe-Zahlungen & Echtzeit-Dashboard.",
    },
  ];

  return (
    <header className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
      <Stars />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Text Block (Span 7) */}
        <motion.div
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Creator Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-600 dark:text-pink-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>Veranstalter & Creator Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-slate-900 dark:text-white">
            Erstelle dein Event & verbinde es mit{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              echtem Impact
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Präsentiere deine Party, dein Konzert, Festival oder deinen Workshop
            auf Actyra. Erreiche tausende Event-Begeisterte und sammle bei jedem
            Ticketkauf automatisch Spenden für gesellschaftlich wichtige
            Projekte.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-[#0d0f26]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-400 leading-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Video / Media Card (Span 5) */}
        <motion.div
          className="lg:col-span-5 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <Tilt
            glareEnable={false}
            perspective={1000}
            scale={1.05}
            transitionSpeed={2500}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            className="flex justify-center relative w-full max-w-md"
          >
            {/* Vorschau-Bild */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/bild2.png"
                alt="Event Vorschau"
                width={480}
                height={480}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Play Button über Bild */}
              <button
                type="button"
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
            </div>
          </Tilt>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideo && <ModalVideo setShowVideo={setShowVideo} />}
    </header>
  );
}
