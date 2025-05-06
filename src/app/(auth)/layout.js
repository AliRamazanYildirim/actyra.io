'use client';
import React, { useEffect, useState } from 'react';

const AuthLayout = ({ children }) => {
       const [stars, setStars] = useState([]);
       // Erzeuge die Sterne nur auf dem Client
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
    <div className="min-h-screen dark:bg-[#0d0e25] flex items-center justify-center relative">
      {children}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star text-[#0d0e25] dark:text-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthLayout;
