"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Interaktive SVG-Welle mit sanfter Animation.
 * Der Farbverlauf entspricht dem Footer-Design.
 * Die Bewegung ist flüssig und beruhigend.
 */

export default function WaveSeparator() {
  const [pathData, setPathData] = useState("");
  const waveRef = useRef(null);

  /**
   * Generiert eine SVG-Pfadlinie für eine sinusförmige Welle.
   * @param {number} amplitude - Höhe der Wellenbewegung
   * @param {number} frequency - Frequenz der Wellenbewegung
   * @param {number} phase - Animationsphase
   * @returns {string} - SVG path data string
   */
  const generateWavePath = (amplitude = 30, frequency = 0.03, phase = 0) => {
    const width = 1200;
    const height = 100;
    const points = 100;
    let path = `M 0 ${height}`;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = Math.sin(i * frequency + phase) * amplitude + 50;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  // useEffect mit langsamer, ruhiger Animation
  useEffect(() => {
    let animationFrameId;
    let phase = 0;

    const animate = () => {
      const newPath = generateWavePath(25, 0.04, phase);
      setPathData(newPath);
      phase += 0.02; // Langsamer, flüssiger Effekt
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      className="w-full overflow-hidden leading-none bg-white dark:bg-[#0D0E25] text-black dark:text-white"
      ref={waveRef}
    >
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="w-full h-20"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />     {/* Indigo */}
            <stop offset="50%" stopColor="#7c3aed" />     {/* Purple */}
            <stop offset="100%" stopColor="#db2777" />    {/* Pink */}
          </linearGradient>
        </defs>

        <path d={pathData} fill="url(#waveGradient)" />
      </svg>
    </div>
  );
}
