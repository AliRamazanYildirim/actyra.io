"use client";
import Image from "next/image";
import { MapPin, Calendar, Euro } from "lucide-react"; // Annahme: Lucide-Icons bereits in Verwendung

// Client-Komponente wegen Button-Events
// Eventvorschau exakt wie Live-Eventkarte mit Weißraum

const EventPreview = ({ formData, onBack, onSubmit }) => {
  return (
    <main className="min-h-screen ">
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-[#12192f] rounded-xl overflow-hidden shadow-xl text-white">
          {formData.image ? (
           <div className="w-full aspect-[3/2] relative">
           <Image
             src={formData.image}
             alt="Event Bild"
             fill
             className="object-contain"
           />
         </div>
         
          
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-purple-800 to-pink-700 flex items-center justify-center">
              <span className="text-white text-xl">Kein Bild verfügbar</span>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2 text-[#c127d9]">
              {formData.title || "Eventname"}
            </h2>

            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> {formData.date || "Datum"}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {formData.location || "Ort"}
              </span>
              <span className="flex items-center">
                <Euro className="h-4 w-4 mr-1" /> {formData.price || "0"} €
              </span>
            </div>

            <p className="text-gray-300 mb-4">
              {formData.description || "Keine Beschreibung verfügbar"}
            </p>

            <hr className="border-pink-500 my-4" />

            <div className="text-sm mb-6">
              <p>Kategorie: {formData.category || "Keine Kategorie"}</p>
              <p>Verfügbare Tickets: {formData.tickets || "0"}</p>
              <p>Spendenbetrag: {formData.donation || "0"} €</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold transition cursor-pointer"
              >
                Zurück bearbeiten
              </button>
              <button
                onClick={onSubmit}
                className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg font-semibold transition cursor-pointer"
              >
                Event speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventPreview;