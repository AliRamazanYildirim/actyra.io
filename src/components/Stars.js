"use client";

import { useEffect, useState } from "react";

export default function Stars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map(() => ({
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 100),
      delay: Math.floor(Math.random() * 5),
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className={`star animate-twinkle absolute text-white text-lg`}
          style={{
            inset: "auto",
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
