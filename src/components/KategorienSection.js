"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 🗂️ İcons
import KategorieKulturMusik from "@/icons/KategorieKulturMusik";
import KategorieSportFreizeit from "@/icons/KategorieSportFreizeit";
import KategorieBildungWorkshop from "@/icons/KategorieBildungWorkshop";
import KategorieBusinessNetworking from "@/icons/KategorieBusinessNetworking";
import KategorieGesundheit from "@/icons/KategorieGesundheit";
import KategorieTechnologieInnovation from "@/icons/KategorieTechnologieInnovation";
import KategorieMessenAusstellungen from "@/icons/KategorieMessenAusstellungen";
import KategorieSonstigeEvents from "@/icons/KategorieSonstigeEvents";

const kategorien = [
  { slug: "kultur-musik", icon: KategorieKulturMusik, name: "Kultur & Musik" },
  { slug: "sport-freizeit", icon: KategorieSportFreizeit, name: "Sport & Freizeit" },
  { slug: "bildung-workshop", icon: KategorieBildungWorkshop, name: "Bildung & Workshop" },
  { slug: "business-networking", icon: KategorieBusinessNetworking, name: "Business & Networking" },
  { slug: "gesundheit", icon: KategorieGesundheit, name: "Gesundheit" },
  { slug: "technologie-innovation", icon: KategorieTechnologieInnovation, name: "Technologie & Innovation" },
  { slug: "messen-ausstellungen", icon: KategorieMessenAusstellungen, name: "Messen & Ausstellungen" },
  { slug: "sonstige-events", icon: KategorieSonstigeEvents, name: "Sonstige Events" },
];

export default function KategorienSection() {
  const [eventsByCategory, setEventsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Neue Funktion zum Abrufen der Events aus der MongoDB
    async function fetchEventsFromMongoDB() {
  try {
    setLoading(true);
    
    // Events von der API abrufen (kein Parameter = alle Events)
    const response = await fetch('/api/events');
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Events');
    }
    
    // API gibt jetzt direkt ein Array zurück
    const events = await response.json();
    
    console.log("MongoDB Events:", events); 
    
    const categorized = {};
    const sonstige = [];

    // Events nach Kategorien gruppieren
    if (Array.isArray(events) && events.length > 0) {
      for (const event of events) {
        if (event && event.category) {
          const matchedCategory = kategorien.find((k) => k.slug === event.category);
          if (matchedCategory) {
            if (!categorized[event.category]) {
              categorized[event.category] = [];
            }
            categorized[event.category].push(event);
          } else {
            sonstige.push(event);
          }
        } else {
          // Wenn ein Event keine Kategorie hat, zu sonstige hinzufügen
          sonstige.push(event);
        }
      }

      // Events ohne Kategorie zu "sonstige-events" hinzufügen
      if (sonstige.length > 0) {
        categorized["sonstige-events"] = sonstige;
      }
    } else {
      console.log("Keine Events gefunden oder events ist kein Array:", events);
    }

    setEventsByCategory(categorized);
    setLoading(false);
  } catch (error) {
    console.error("Fehler beim Laden der MongoDB-Events:", error);
    setError(error.message);
    setLoading(false);
  }
}

    fetchEventsFromMongoDB();
  }, []);

  return (
    <section id="kategorien" className="scroll-mt-24">
      <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4 text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Kategorien
          </span>
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-left">
          Entdecke{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Events nach Kategorien
          </span>{" "}
          – finde dein Highlight und unterstütze dabei gute Zwecke.
        </p>

        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Ihre Kategorien werden geladen...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            Fehler beim Laden der Events: {error}
          </div>
        ) : Object.keys(eventsByCategory).length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Keine Events gefunden</p>
          </div>
        ) : (
          <div className="space-y-12">
            {kategorien.map((kategorie, index) => {
              const IconComponent = kategorie.icon;
              const events = eventsByCategory[kategorie.slug] || [];

              if (events.length === 0) return null;

                return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-4">
                  {/* Orta: Symbol + h3 zusammen zentriert */}
                  <div className="flex items-center mx-auto space-x-4">
                    <IconComponent className="w-10 h-10 text-[#613583]" />
                    <h3 className="text-2xl font-semibold text-[#1c1f3c] dark:text-white">
                    {kategorie.name}
                    </h3>
                  </div>

                  {/* Rechts: Link */}
                  <Link
                    href={`/kategorien/${kategorie.slug}`}
                    className="text-sm font-medium dark:text-white hover:underline"
                  >
                    Alle anzeigen →
                  </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
                  {events.map((event, eventIndex) => (
                    <Link
                    key={event._id || `event-${index}-${eventIndex}`}
                    href={`/events/${event.slug || "#"}`}
                    className="block p-4 rounded-xl dark:bg-pink-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition duration-300 group"
                    >
                    <h4 className="text-lg font-semibold text-black dark:text-white group-hover:text-white">
                      {event.title || "Unbenanntes Event"}
                    </h4>
                    <p className="text-sm text-black dark:text-white group-hover:text-white">
                      {event.location || "Kein Ort angegeben"}
                    </p>
                    <p className="text-sm text-black dark:text-white group-hover:text-white">
                      {event.date
                      ? new Date(event.date).toLocaleDateString("de-DE")
                      : "Kein Datum"}
                    </p>
                    </Link>
                  ))}
                  </div>
                </div>
                );
            })}
          </div>
        )}
      </div>
    </section>
  );
}