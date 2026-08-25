"use client";

import { useState, useEffect, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import fallbackEvents from "@/data/eventSeedData";

const formatDate = (dateStr) => {
  const options = { day: "2-digit", month: "short" };
  return new Date(dateStr).toLocaleDateString("de-DE", options);
};

const EventListSection = memo(() => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Daten");
      }

      const data = await response.json();
      if (data?.events && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents(fallbackEvents);
      }
    } catch (err) {
      console.error("API-Fehler:", err);
      setError("Fehler beim Laden der Events");
      setEvents(fallbackEvents);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <section
      id="events"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Aktuelle{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Events & Erlebnisse
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl">
            Sichere dir deinen Platz bei den beliebtesten Community- und
            Charity-Events.
          </p>
        </div>

        <Link
          href="/events"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
        >
          <span>Alle Events ansehen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-0 animate-pulse space-y-4"
            >
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-full pt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.slice(0, 6).map((event, index) => (
            <div
              key={event._id || event.slug || index}
              className="group flex flex-col premium-card overflow-hidden"
            >
              {/* Event Image */}
              <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center p-4">
                    <span className="text-white font-bold text-center">
                      {event.title}
                    </span>
                  </div>
                )}

                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {formatDate(event.date)}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {event.price === 0 ? "Kostenlos" : `${event.price} €`}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                    {event.title}
                  </h3>

                  {/* Meta details */}
                  <div className="space-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                      <span className="truncate">
                        {event.location || "Ort folgt"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/events/${event.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 shadow-md shadow-pink-500/10 transition-all duration-200"
                >
                  <span>Jetzt teilnehmen</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile "Alle Events" Button */}
      <div className="mt-10 text-center sm:hidden">
        <Link
          href="/events"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white text-sm font-semibold rounded-full hover:bg-pink-600 transition-colors"
        >
          <span>Alle Events anzeigen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
});

EventListSection.displayName = "EventListSection";

export default EventListSection;
