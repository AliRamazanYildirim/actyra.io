// components/Stars.js
'use client';
import React, { useEffect, useState } from 'react';

// Kenarlarda ve bölümler arasındaki boşluklarda dengeli ve estetik yıldız dağılımı
const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const glyphs = ['✦', '✧', '⋆', '★'];
    const generatedStars = [];

    // 1. Kenar Yıldızları (16 Adet - Sağ ve Sol Boşluklar)
    for (let i = 0; i < 16; i++) {
      const isLeft = i % 2 === 0;
      const leftPos = isLeft 
        ? 1.5 + Math.random() * 11.5   // Sol kenar: %1.5 - %13
        : 87.0 + Math.random() * 11.5; // Sağ kenar: %87 - %98.5

      generatedStars.push({
        id: `side-${i}`,
        top: 3 + Math.random() * 94,
        left: leftPos,
        size: 10 + Math.random() * 6, // 10px - 16px
        duration: 3.2 + Math.random() * 2.5,
        delay: Math.random() * 4,
        glyph: glyphs[i % glyphs.length],
        colorClass:
          i % 3 === 0
            ? 'text-pink-400/80 dark:text-pink-400/90'
            : i % 3 === 1
            ? 'text-purple-400/70 dark:text-purple-300/80'
            : 'text-slate-400/60 dark:text-white/80',
      });
    }

    // 2. Orta Bölüm Yıldızları (8 Adet - Bölüm aralarındaki boşluklar için çok hafif ve zarif)
    const midZones = [
      { minTop: 6, maxTop: 12 },   // Hero üst boşluk
      { minTop: 28, maxTop: 36 },  // Hero ile Intro arası
      { minTop: 52, maxTop: 60 },  // Intro ile EventList arası
      { minTop: 76, maxTop: 84 },  // Kategoriler ile Footer arası
    ];

    midZones.forEach((zone, idx) => {
      // Her boşluk bölgesine 2 şer adet seyrek yıldız
      for (let j = 0; j < 2; j++) {
        generatedStars.push({
          id: `mid-${idx}-${j}`,
          top: zone.minTop + Math.random() * (zone.maxTop - zone.minTop),
          left: 22 + Math.random() * 56, // Orta alan: %22 - %78
          size: 9 + Math.random() * 5,   // 9px - 14px (küçük ve zarif)
          duration: 4.0 + Math.random() * 2.5,
          delay: Math.random() * 4.5,
          glyph: glyphs[(idx + j) % glyphs.length],
          colorClass:
            j === 0
              ? 'text-purple-400/40 dark:text-purple-300/60'
              : 'text-pink-400/40 dark:text-pink-300/60',
        });
      }
    });

    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.colorClass}`}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            fontSize: `${star.size}px`,
            animation: `twinkle ${star.duration}s infinite ease-in-out`,
            animationDelay: `${star.delay}s`,
          }}
        >
          {star.glyph}
        </div>
      ))}
    </div>
  );
};

export default Stars;