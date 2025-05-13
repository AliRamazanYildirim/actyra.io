import NavBar from "@/components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Euro } from "lucide-react";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData.js"; // Fallback-Daten bei Fehlern oder leerer DB

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
      console.log(
        "Keine Events in der Datenbank gefunden. Fallback-Daten werden verwendet."
      );
      return eventSeedData;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error);
    return eventSeedData;
  }
}

export default async function EventsPage() {
  // Events aus DB oder Fallback laden
  const events = await getEvents();

  // Datum formatieren
  const formatDate = (dateStr) => {
    const options = { day: "2-digit", month: "short" };
    return new Date(dateStr).toLocaleDateString("de-DE", options);
  };

  return (
    <>
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
          Aktuelle Events
        </h1>

        <p className="mb-10 text-lg leading-relaxed">
          Willkommen bei{" "}
          <span className="font-semibold text-purple-700">Actyra</span> – deiner
          Plattform für unvergessliche Begegnungen, echte Erlebnisse und soziale
          Highlights.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {events.map((event) => (
            <div
              key={event._id || event.slug}
              className="relative bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600"
            >
              {/* Datum oben links */}
              <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full z-10 font-bold">
                {formatDate(event.date)}
              </div>

              {/* Event Bild */}
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

              {/* Event Inhalt */}
              <div className="p-5 space-y-2">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {event.tags &&
                    event.tags.map((tag, idx) => (
                      <span
                        key={idx}
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

                {/* Call to Action */}
                <Link href={`/events/${event.slug}`} passHref>
                  <button className="mt-4 px-4 py-2 rounded-full bg-pink-700 hover:bg-pink-700 text-white font-semibold w-full cursor-pointer">
                    Jetzt teilnehmen
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Keine Events vorhanden */}
        {events.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Keine Events gefunden.</p>
            <p className="text-gray-500 mt-2">
              Schau später noch einmal vorbei.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
