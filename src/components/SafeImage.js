"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function SafeImage({ src, alt, priority = false, ...props }) {
  // Überprüfe nur wirklich falsche URL-Muster.
  const isInvalidUrl =
    src &&
    (src.includes("undefined") ||
      src.match(/^\d+-event-default\.webp$/) ||
      src.match(/^\/images\/\d+-event-default\.webp$/)); // Nur die event-default-Dateien sind ungültig.

  const defaultImage = "/images/event-default.webp";
  const [imgSrc, setImgSrc] = useState(
    isInvalidUrl ? defaultImage : src || defaultImage
  );
  const [hasError, setHasError] = useState(false);

  // Aktualisiere den Zustand, wenn Src sich ändert
  useEffect(() => {
    if (src !== imgSrc && !isInvalidUrl && !hasError) {
      setImgSrc(src || defaultImage);
      setHasError(false);
    }
  }, [src, imgSrc, isInvalidUrl, hasError, defaultImage]);

  const handleError = () => {
    console.log(`Image load failed, using fallback: ${imgSrc} -> ${defaultImage}`);
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage);
      setHasError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Event Image"}
      priority={priority}
      onError={handleError}
      unoptimized={true}  // Next.js Bildoptimierung deaktivieren - erforderlich für lokale Dateien
    />
  );
}
