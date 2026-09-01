import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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

export async function generateStaticParams() {
  return kategorien.map((kategorie) => ({
    slug: kategorie.slug,
  }));
}

export async function getEvents(slug) {
  try {
    await dbConnect();
    const events = await Event.find({ category: slug }).sort({ date: 1 });

    if (events && events.length > 0) {
      return events.map((event) => {
        const plainEvent = event.toObject();
        return {
          ...plainEvent,
          _id: plainEvent._id.toString(),
        };
      });
    } else {
      const filteredSeed = eventSeedData.filter((e) => e.category === slug);
      return filteredSeed.map((event, idx) => ({
        ...event,
        _id: event._id || `seed-${idx}`,
      }));
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Events aus der Datenbank:", error);
    const filteredSeed = eventSeedData.filter((e) => e.category === slug);
    return filteredSeed.map((event, idx) => ({
      ...event,
      _id: event._id || `seed-${idx}`,
    }));
  }
}

export default async function KategoriePage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const events = await getEvents(slug);

  if (!events) {
    notFound();
  }

  const kategorie = kategorien.find((k) => k.slug === slug);
  if (!kategorie && slug !== "sonstige-events") {
    notFound();
  }

  const IconComponent = kategorie?.icon;
  const kategorieName = kategorie?.name || "Sonstige Events";

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Back button */}
      <Link
        href="/#kategorien"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Zurück zu allen Kategorien</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {IconComponent && (
          <div className="p-3.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 w-fit">
            <IconComponent className="w-8 h-8" />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {kategorieName}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Entdecke alle aktuellen Veranstaltungen in dieser Kategorie (
            {events.length} Events gefunden).
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Aktuell sind keine Events in dieser Kategorie verfügbar.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Alle Events anzeigen</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event, index) => (
            <div
              key={event._id ? event._id.toString() : event.slug || index}
              className="group flex flex-col bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-pink-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center p-4">
                    <span className="text-white font-bold text-center">
                      {event.title}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {event.price === 0 ? "Kostenlos" : `${event.price} €`}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span className="truncate">
                        {event.location || "Ort folgt"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>
                        {event.date
                          ? new Date(event.date).toLocaleDateString("de-DE")
                          : "Datum folgt"}
                      </span>
                    </div>
                  </div>

                  {event.shortDescription && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1">
                      {event.shortDescription}
                    </p>
                  )}
                </div>

                <Link
                  href={`/events/${event.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xs font-semibold hover:opacity-90 shadow-md shadow-pink-500/10 transition-all"
                >
                  <span>Details & Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
