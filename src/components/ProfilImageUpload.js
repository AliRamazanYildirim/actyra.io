import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, X as XIcon } from "lucide-react";

export default function ProfilImageUpload({ 
    image, 
    setImage, 
    uploadedImage, 
    setUploadedImage, 
    imageError, 
    setImageError 
}) {
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Bitte wählen Sie eine Bilddatei aus.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Die Datei ist zu groß. Bitte wählen Sie eine Datei, die kleiner als 5MB ist.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (upload) => {
            setUploadedImage(upload.target.result);
            setImage(""); // URL-Eingabe zurücksetzen
        };

        reader.readAsDataURL(file);
    };

    const clearUploadedImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Bestimmen Sie das anzuzeigende Bild
    const displayImage = uploadedImage || image;

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Profilbild</label>

            {/* Datei-Upload */}
            <div className="mb-4">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 bg-gray-700/30 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="w-4 h-4" />
                        Bild hochladen
                    </Button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    {uploadedImage && (
                        <span className="text-sm text-green-400 flex items-center gap-1">
                            Bild hochgeladen
                            <button
                                onClick={clearUploadedImage}
                                className="ml-1 p-1 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer"
                            >
                                <XIcon className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-200 mt-1">
                    Maximale Dateigröße: 5MB
                </p>
            </div>

            {/* URL-Eingabe */}
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <label htmlFor="image" className="block text-xs font-medium mb-1">
                        Oder verwenden Sie eine Bild-URL:
                    </label>
                    <input
                        id="image"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        disabled={!!uploadedImage}
                    />
                </div>

                {/* Bildvorschau */}
                <div className="h-14 w-14 rounded-full overflow-hidden relative border-2 border-pink-500">
                    {displayImage && !imageError ? (
                        <Image
                            src={displayImage}
                            alt="Vorschau"
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                            Vorschau
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}