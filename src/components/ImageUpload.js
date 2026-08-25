"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Bitte wähle eine gültige Bilddatei (JPG, PNG, WebP) aus.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Die Dateigröße darf maximal 10MB betragen.");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    onImageUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName("");
    setFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageUpload(null);
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-pink-500 bg-pink-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 hover:border-pink-500/60 bg-slate-50/70 dark:bg-[#141738]/50 hover:bg-slate-100/70 dark:hover:bg-[#141738]"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              <span className="text-pink-600 dark:text-pink-400 underline underline-offset-2">
                Hier klicken
              </span>{" "}
              oder Bild per Drag & Drop ablegen
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unterstützt JPG, PNG, WebP (Empfohlen: 1200x800 px, max. 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md group">
          <div className="relative w-full h-56 sm:h-64">
            <Image
              src={preview}
              alt="Event Vorschau"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Overlay Info & Remove Button */}
          <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-white min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-semibold truncate">
                  {fileName || "Titelbild"}
                </p>
                {fileSize && (
                  <p className="text-[11px] text-slate-300">{fileSize}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition cursor-pointer"
              >
                Ändern
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition cursor-pointer shadow-md"
                title="Bild entfernen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
