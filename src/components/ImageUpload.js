"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya kontrolü
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir resim dosyası seçin.");
      return;
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    // Önizleme için URL oluştur
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Üst bileşene bildir
    onImageUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Dosya seçme düğmesi */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
        >
          Bild auswählen
        </button>
        <span className="text-gray-600">
          {preview ? "Bild ausgewählt" : "Kein Bild ausgewählt"}
        </span>
      </div>

      {/* Gizli dosya girişi */}
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