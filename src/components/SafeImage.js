"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function SafeImage({ src, alt, priority = false, ...props }) {
  // Yanlış URL pattern'lerini kontrol et
  const isInvalidUrl =
    src &&
    (src.includes("undefined") ||
      src.match(/^\d+-event-default\.webp$/) ||
      src.match(/^\/images\/\d+-event-default\.webp$/) ||
      src.match(/^\/images\/\d+-.+\.(png|jpg|jpeg)$/) || // /images/ ile başlayan timestamped dosyalar
      src.match(/^\d+-.+\.(png|jpg|jpeg)$/)); // images/ olmayan timestamped dosyalar

  const defaultImage = "/images/event-default.webp";
  const [imgSrc, setImgSrc] = useState(
    isInvalidUrl ? defaultImage : src || defaultImage
  );
  const [hasError, setHasError] = useState(false);

  // Debug log
  if (isInvalidUrl) {
    console.log(`🚫 Invalid URL detected and blocked: ${src}`);
  }

  // Src değiştiğinde state'i güncelle
  useEffect(() => {
    if (src !== imgSrc && !isInvalidUrl && !hasError) {
      setImgSrc(src || defaultImage);
      setHasError(false);
    }
  }, [src, imgSrc, isInvalidUrl, hasError, defaultImage]);

  const handleError = () => {
    console.log(`Image load failed for: ${imgSrc}, falling back to default`);
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
    />
  );
}
