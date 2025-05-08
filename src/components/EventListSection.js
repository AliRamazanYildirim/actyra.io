// src/components/EventListSection.js

"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Tag, Euro } from "lucide-react";

const events = [
  {
    title: "Neon Club Night",
    location: "Berlin",
    date: "2025-06-01",
    price: 15,
    imageUrl: "/images/event1.webp",
    slug: "neon-club-night",
    tags: ["Party", "Berlin"],
    shortDescription:
      "Erlebe eine Nacht voller Neonlichter und Musik in Berlin.",
    longDescription:
      "Die Neon Club Night bringt Berlins Nachtleben zum Leuchten – mit internationalen DJs, spektakulären Lichteffekten und einer elektrisierenden Atmosphäre.",
  },
  {
    title: "Open Air Festival",
    location: "Hamburg",
    date: "2025-07-15",
    price: 0,
    imageUrl: "/images/event2.webp",
    slug: "open-air-festival",
    tags: ["Festival", "Live Musik"],
    shortDescription: "Feiere unter freiem Himmel mit Livemusik in Hamburg.",
    longDescription:
      "Genieße ein vielseitiges Line-up aus lokalen und internationalen Acts auf unserem familienfreundlichen Open Air Festival im Herzen Hamburgs.",
  },
  {
    title: "Tech Meetup",
    location: "München",
    date: "2025-08-10",
    price: 5,
    imageUrl: "/images/event3.webp",
    slug: "tech-meetup",
    tags: ["Networking", "Tech"],
    shortDescription: "Netzwerke mit Tech-Enthusiasten in München.",
    longDescription:
      "Ob Entwickler:in, Designer:in oder Tech-Founder – unser Meetup bietet Impulsvorträge, Networking und spannende Diskussionen.",
  },
  {
    title: "Yoga im Park",
    location: "Köln",
    date: "2025-05-25",
    price: 0,
    imageUrl: "/images/event4.webp",
    slug: "yoga-im-park",
    tags: ["Outdoor", "Wellness"],
    shortDescription: "Finde innere Ruhe bei einer Yoga-Session im Grünen.",
    longDescription:
      "Unser kostenloses Outdoor-Yoga bietet Bewegung, Achtsamkeit und frische Luft. Komm vorbei, egal ob Anfänger:in oder Fortgeschrittene:r.",
  },
  {
    title: "Kunst & Wein Abend",
    location: "Stuttgart",
    date: "2025-09-01",
    price: 12,
    imageUrl: "/images/event5.webp",
    slug: "kunst-wein-abend",
    tags: ["Kunst", "Social"],
    shortDescription: "Genieße Kunstwerke bei einem guten Glas Wein.",
    longDescription:
      "Ein inspirierender Abend mit regionalen Künstler:innen, geführter Ausstellung und Weinverkostung in stilvoller Atmosphäre.",
  },
  {
    title: "Game Night",
    location: "Leipzig",
    date: "2025-10-05",
    price: 3,
    imageUrl: "/images/event6.webp",
    slug: "game-night",
    tags: ["Spiele", "Fun"],
    shortDescription: "Zocke Brett- & Partyspiele mit neuen Leuten.",
    longDescription:
      "Unsere Game Night bietet Spielspaß in geselliger Runde mit Klassikern und neuen Favoriten. Snacks & gute Stimmung inklusive.",
  },
];

const formatDate = (dateStr) => {
  const options = { day: "2-digit", month: "short" };
  return new Date(dateStr).toLocaleDateString("de-DE", options);
};

export default function EventListSection() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600"
            >
              {/* Datum oben links */}
              <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full z-10 font-bold">
                {formatDate(event.date)}
              </div>

              {/* Event Bild */}
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />

              {/* Event Inhalt */}
              <div className="p-5 space-y-2">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
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
      </div>
    </section>
  );
}
