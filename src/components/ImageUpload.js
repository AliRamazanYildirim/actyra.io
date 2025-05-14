"use client";
import { useState, useRef } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dateiüberprüfung
    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    // Dateigrößenüberprüfung (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Die Dateigröße muss kleiner als 10MB sein.");
      return;
    }

    // URL für Vorschau erstellen
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // An die übergeordnete Komponente melden
    onImageUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Schaltfläche zum Auswählen der Datei */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
        >
          Bild auswählen
        </button>
        <span className="text-black">
          {preview ? "Bild ausgewählt" : "Kein Bild ausgewählt"}
        </span>
      </div>

      {/* Verstecktes Datei-Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;