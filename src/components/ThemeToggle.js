"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // State für Dark Mode und Client-seitiges Mounting
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialisiere Theme beim ersten Laden
  useEffect(() => {
    setMounted(true);
    
    // Überprüfe gespeicherte Präferenz oder System-Einstellung
    const isDark = 
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && 
       window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    // Aktualisiere DOM und State mit Ternary
    document.documentElement.classList.toggle("dark", isDark);
    setIsDarkMode(isDark);
  }, []);

  // Toggle zwischen Light und Dark Mode
const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);

    // Aktualisiere DOM-Klasse mit Ternary
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.theme = newIsDark ? "dark" : "light";
};

  // Verhindert Hydration-Fehler
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer"
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}