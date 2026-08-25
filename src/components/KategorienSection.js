"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Layers, MapPin, Calendar } from "lucide-react";
import fallbackEvents from "@/data/eventSeedData";

// Categories definition with icons and colors
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
  {
    slug: "sport-freizeit",
    icon: KategorieSportFreizeit,
    name: "Sport & Freizeit",
  },
  {
    slug: "bildung-workshop",
    icon: KategorieBildungWorkshop,
    name: "Bildung & Workshop",
  },
  {
    slug: "business-networking",
    icon: KategorieBusinessNetworking,
    name: "Business & Networking",
  },
  { slug: "gesundheit", icon: KategorieGesundheit, name: "Gesundheit" },
  {
    slug: "technologie-innovation",
    icon: KategorieTechnologieInnovation,
    name: "Technologie & Innovation",
  },
  {
    slug: "messen-ausstellungen",
    icon: KategorieMessenAusstellungen,
    name: "Messen & Ausstellungen",
  },
  {
    slug: "sonstige-events",
    icon: KategorieSonstigeEvents,
    name: "Sonstige Events",
  },
];

export default function KategorienSection() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data?.events)
            ? data.events
            : Array.isArray(data)
              ? data
              : [];
          setAllEvents(list.length ? list : fallbackEvents);
        } else {
          setAllEvents(fallbackEvents);
        }
      } catch {
        setAllEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Group events by category in memory (No N+1 API requests)
  const eventsByCategory = useMemo(() => {
    const map = {};
    kategorien.forEach((k) => {
      map[k.slug] = [];
    });

    allEvents.forEach((event) => {
      const cat = event.category || "sonstige-events";
      if (map[cat]) {
        map[cat].push(event);
      } else {
        if (!map["sonstige-events"]) map["sonstige-events"] = [];
        map["sonstige-events"].push(event);
      }
    });

    return map;
  }, [allEvents]);

  const activeCategories = useMemo(() => {
    if (selectedCategory === "all") {
      return kategorien.filter(
        (k) => (eventsByCategory[k.slug] || []).length > 0,
      );
    }
    return kategorien.filter((k) => k.slug === selectedCategory);
  }, [selectedCategory, eventsByCategory]);

  return (
    <section
      id="kategorien"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Themenwelten</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Entdecke Events nach{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Kategorien
          </span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl">
          Finde genau das Erlebnis, das zu deinen Interessen passt, und
          unterstütze dabei gezielt soziale Projekte.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-10 no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-pink-500/25 border border-transparent"
              : "bg-white dark:bg-[#0d0f26]/95 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm shadow-slate-200/80 hover:shadow-md hover:shadow-slate-300/60 dark:shadow-none dark:hover:shadow-none hover:border-pink-500/50 hover:text-pink-600 dark:hover:text-pink-400 hover:-translate-y-0.5"
          }`}
        >
          Alle Kategorien
        </button>

        {kategorien.map((kat) => {
          const count = (eventsByCategory[kat.slug] || []).length;
          return (
            <button
              key={kat.slug}
              onClick={() => setSelectedCategory(kat.slug)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                selectedCategory === kat.slug
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-pink-500/25 border border-transparent"
                  : "bg-white dark:bg-[#0d0f26]/95 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm shadow-slate-200/80 hover:shadow-md hover:shadow-slate-300/60 dark:shadow-none dark:hover:shadow-none hover:border-pink-500/50 hover:text-pink-600 dark:hover:text-pink-400 hover:-translate-y-0.5"
              }`}
            >
              <span>{kat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                    selectedCategory === kat.slug
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Categories Content */}
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"
              />
            ))}
          </div>
        </div>
      ) : activeCategories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Für diese Kategorie sind aktuell keine Events geplant.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {activeCategories.map((kat) => {
            const Icon = kat.icon;
            const events = eventsByCategory[kat.slug] || [];
            if (events.length === 0) return null;

            return (
              <div key={kat.slug} className="space-y-5">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {kat.name}
                    </h3>
                  </div>

                  <Link
                    href={`/kategorien/${kat.slug}`}
                    className="text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Alle ({events.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.slice(0, 3).map((event, idx) => (
                    <Link
                      key={event._id || `event-${kat.slug}-${idx}`}
                      href={`/events/${event.slug || "#"}`}
                      className="group p-6 premium-card flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-base sm:text-[17px] text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors line-clamp-1 mb-3">
                          {event.title || "Unbenanntes Event"}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span className="truncate max-w-[130px]">
                              {event.location || "Ort folgt"}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>
                              {event.date
                                ? new Date(event.date).toLocaleDateString(
                                    "de-DE",
                                  )
                                : "Datum folgt"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {event.price === 0 ? "Kostenlos" : `${event.price} €`}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-500/10 group-hover:bg-pink-500 group-hover:text-white transition-all duration-200">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
