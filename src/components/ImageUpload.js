"use client"; // Client-Komponente

// src/components/ImageUpload.js
// Deutlich sichtbarer Upload-Button für Flyer/Eventbild

import { useRef } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
      >
        Bild auswählen
      </button>
    </div>
  );
};

export default ImageUpload;
