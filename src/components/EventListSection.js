"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Tag, Euro } from "lucide-react";
import fallbackEvents from "@/data/eventSeedData";

/**
 * Date formatting utility using ES6+ arrow function
 */
const formatDate = (dateStr) => {
  const options = { day: "2-digit", month: "short" };
  return new Date(dateStr).toLocaleDateString("de-DE", options);
};

/**
 * EventListSection Component - ES6+ and Next.js 15 optimized
 * Modern component with React.memo, useCallback, and ES6+ patterns
 */
const EventListSection = memo(() => {
  // ES6+ State definitions with destructuring
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ES6+ API fetch function with useCallback
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Daten");
      }

      const data = await response.json();

      // ES6+ Optional chaining and array validation
      if (data?.events && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        // Fallback data when no valid data from API
        setEvents(fallbackEvents);
      }
    } catch (error) {
      console.error("API-Fehler:", error);
      setError("Fehler beim Laden der Events");
      // Fallback data on error
      setEvents(fallbackEvents);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ES6+ useEffect with dependency array
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <section id="events" className="">
      <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
          Aktuelle Events
        </h2>
        <p className="mb-10 text-lg leading-relaxed">
          Willkommen bei{" "}
          <span className="font-semibold text-purple-700">Actyra</span> – deiner
          Plattform für unvergessliche Begegnungen, echte Erlebnisse und soziale
          Highlights.
        </p>

        {isLoading ? (
          // Ladezustand
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Ihre Events werden geladen...</p>
          </div>
        ) : error ? (
          // Fehlerzustand
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-gray-600">Fallback-Daten werden angezeigt.</p>
          </div>
        ) : (
          // Normale Event-Karten
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={event._id || event.slug || index}
                className="relative bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600"
              >
                {/* Datum oben links */}
                <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full z-10 font-bold">
                  {formatDate(event.date)}
                </div>

                {/* Event-Bild */}
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold">{event.title}</span>
                  </div>
                )}

                {/* Event-Inhalt */}
                <div className="p-5 space-y-2">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {event.tags &&
                      event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-pink-700 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Titel */}
                  <h3 className="text-xl font-semibold mt-2">{event.title}</h3>

                  {/* Ort */}
                  <div className="flex items-center gap-1 text-sm text-pink-100">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>

                  {/* Datum */}
                  <div className="flex items-center gap-1 text-sm text-pink-100">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString("de-DE")}
                  </div>

                  {/* Preis */}
                  <div className="flex items-center gap-1 text-sm text-white">
                    <Euro className="w-4 h-4" />
                    {event.price === 0
                      ? "Kostenlos / Spende"
                      : `${event.price} €`}
                  </div>

                  {/* CTA-Button mit Link zur Detailseite */}
                  <Link href={`/events/${event.slug}`} passHref>
                    <button className="mt-4 px-4 py-2 rounded-full bg-pink-700 hover:bg-pink-700 text-white font-semibold w-full cursor-pointer">
                      Jetzt teilnehmen
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* "Alle Events anzeigen"-Button - Only show when data is loaded and no error */}
        {!isLoading && !error && events.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/events" passHref>
              <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer">
                Alle Events anzeigen
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});

// ES6+ Display name for debugging  
EventListSection.displayName = "EventListSection";

export default EventListSection;
