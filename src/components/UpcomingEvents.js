import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import eventSeedData from "@/data/eventSeedData.js";
import { useUser } from "@clerk/nextjs";

export default function UpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && eventSeedData && eventSeedData.length > 0) {
      setUpcomingEvents([
        {
          ...eventSeedData[2],
          id: eventSeedData[2].slug,
          date: new Date(eventSeedData[2].date).toLocaleDateString("de-DE"),
        },
        {
          ...eventSeedData[3],
          id: eventSeedData[3].slug,
          date: new Date(eventSeedData[3].date).toLocaleDateString("de-DE"),
        },
      ]);
    }
  }, [user]);

  return (
    <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Kommende Veranstaltungen
        </h2>
        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
          Empfohlen für dich
        </span>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Clock className="w-16 h-16 mx-auto text-slate-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aktuell keine anstehenden Termine gefunden.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Events entdecken</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.slug || event.id}
              className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 hover:border-pink-500/30 transition-all group"
            >
              <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    {event.location}
                  </span>
                </div>
              </div>

              <Link
                href={`/events/${event.slug || event.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-pink-600 dark:hover:bg-pink-600 text-white text-xs font-semibold transition-all shadow-sm shrink-0"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}