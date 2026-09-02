"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = (targetDark) => {
    if (targetDark === isDarkMode) return;
    const newIsDark = targetDark !== undefined ? targetDark : !isDarkMode;
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.theme = newIsDark ? "dark" : "light";
  };

  if (!mounted) {
    return (
      <div className="w-18 h-9 rounded-full bg-slate-200/60 dark:bg-[#0f122e] border border-slate-300/40 dark:border-slate-800" />
    );
  }

  return (
    <div
      className="relative flex items-center gap-1 p-1 rounded-full bg-slate-200/90 dark:bg-[#0c0e28]/95 border border-slate-300/80 dark:border-slate-800 shadow-inner backdrop-blur-md select-none transition-all duration-300"
      role="radiogroup"
      aria-label="Theme switcher"
      suppressHydrationWarning
    >
      {/* Tam Yuvarlak Kayan Işıklı Daire (Aspect Square 1:1) */}
      <motion.div
        className="absolute top-1 left-1 w-7 h-7 rounded-full aspect-square pointer-events-none"
        animate={{
          x: isDarkMode ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
          boxShadow: isDarkMode
            ? "0 0 14px 2px rgba(56, 189, 248, 0.45)"
            : "0 0 14px 2px rgba(251, 191, 36, 0.45)",
        }}
      />

      {/* Light Mode Butonu (Tam Yuvarlak) */}
      <motion.button
        type="button"
        onClick={() => toggleTheme(false)}
        whileTap={{ scale: 0.9 }}
        className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full aspect-square transition-colors duration-200 cursor-pointer ${
          !isDarkMode
            ? "text-white"
            : "text-slate-400 dark:text-slate-400 hover:text-slate-200"
        }`}
        title="Heller Modus"
        aria-label="Heller Modus"
        aria-checked={!isDarkMode}
        role="radio"
      >
        <Sun
          strokeWidth={2.7}
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            !isDarkMode
              ? "scale-105 rotate-45 text-white"
              : "scale-100 text-slate-400 dark:text-slate-400 opacity-90"
          }`}
        />
      </motion.button>

      {/* Dark Mode Butonu (Tam Yuvarlak) */}
      <motion.button
        type="button"
        onClick={() => toggleTheme(true)}
        whileTap={{ scale: 0.9 }}
        className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full aspect-square transition-colors duration-200 cursor-pointer ${
          isDarkMode ? "text-white" : "text-slate-500 hover:text-slate-800"
        }`}
        title="Dunkler Modus"
        aria-label="Dunkler Modus"
        aria-checked={isDarkMode}
        role="radio"
      >
        <Moon
          strokeWidth={2.6}
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isDarkMode
              ? "scale-105 -rotate-12 text-white"
              : "scale-100 text-slate-500 opacity-90"
          }`}
        />
      </motion.button>
    </div>
  );
}
