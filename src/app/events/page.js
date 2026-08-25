import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData.js";

// Holt Events aus der MongoDB oder nutzt Fallback-Daten
async function getEvents() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ date: 1 });

    if (events.length > 0) {
      return events.map((event) => {
        const plainEvent = event.toObject();
        return {
          ...plainEvent,
          _id: plainEvent._id.toString(),
        };
      });
    } else {
      return eventSeedData;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error);
    return eventSeedData;
  }
}

export const metadata = {
  title: "Events entdecken | Actyra",
  description:
    "Entdecke soziale Events mit Wirkung. Konzerte, Kultur, Workshops und mehr.",
};

export default async function EventsPage() {
  const events = await getEvents();

  const formatDate = (dateStr) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("de-DE", options);
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 text-center md:text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alle Veranstaltungen</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Entdecke{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Aktuelle Events
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Buche unvergessliche Erlebnisse und unterstütze bei jedem Ticketkauf
          automatisch gemeinnützige Organisationen.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.map((event, index) => (
          <div
            key={event._id || event.slug || index}
            className="group flex flex-col bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-pink-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <SafeImage
                src={event.imageUrl}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 3}
              />

              {/* Date Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {formatDate(event.date)}
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {event.price === 0 ? "Kostenlos" : `${event.price} €`}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                  {event.title}
                </h2>

                {/* Meta details */}
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                    <span className="line-clamp-1">
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

                {event.shortDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                    {event.shortDescription}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={`/events/${event.slug}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 shadow-md shadow-pink-500/10 transition-all duration-200 group-hover:shadow-pink-500/25"
              >
                <span>Details & Tickets</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Keine Events gefunden.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Schau später noch einmal vorbei oder erstelle dein eigenes Event.
          </p>
        </div>
      )}
    </div>
  );
}
