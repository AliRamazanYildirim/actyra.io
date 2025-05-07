// components/StarBackground.js
'use client';
import React, { useEffect, useState } from 'react';

const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star text-yellow-500 dark:text-white"
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: 'twinkle 2s infinite',
            animationDelay: `${star.delay}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

export default Stars;