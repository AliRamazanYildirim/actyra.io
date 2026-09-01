import Image from "next/image";
import { Calendar, MapPin, CheckCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import eventSeedData from "@/data/eventSeedData.js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AttendedEvents() {
  const [attendedEvents, setAttendedEvents] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && eventSeedData && eventSeedData.length > 0) {
      setAttendedEvents([
        {
          ...eventSeedData[0],
          id: eventSeedData[0].slug,
          date: new Date(eventSeedData[0].date).toLocaleDateString("de-DE"),
        },
        {
          ...eventSeedData[1],
          id: eventSeedData[1].slug,
          date: new Date(eventSeedData[1].date).toLocaleDateString("de-DE"),
        },
      ]);
    }
  }, [user]);

  return (
    <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Besuchte Veranstaltungen
        </h2>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          {attendedEvents.length} Events
        </span>
      </div>

      {attendedEvents.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <CheckCircle className="w-16 h-16 mx-auto text-slate-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Du hast noch an keiner Veranstaltung teilgenommen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attendedEvents.map((event) => (
            <div
              key={event.slug || event.id}
              className="bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3 p-4"
            >
              <div className="h-40 relative rounded-xl overflow-hidden bg-slate-900">
                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10 shadow-md">
                  Teilgenommen
                </div>
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center p-4">
                    <span className="text-white font-bold text-center text-sm">
                      {event.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
