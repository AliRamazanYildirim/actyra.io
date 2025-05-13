// src/app/events/[slug]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Euro, ChevronLeft } from "lucide-react";

import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";

export async function generateStaticParams() {
  try {
    await dbConnect();
    const events = await Event.find({});
    return events.map(event => ({ 
      slug: event.slug 
    }));
  } catch (error) {
    console.error("Statik parametre getirme hatası:", error);
    return [];
  }
}

// Veritabanından event bilgisini getiren yardımcı fonksiyon
async function getEventBySlug(slug) {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });
    return event ? JSON.parse(JSON.stringify(event)) : null;
  } catch (error) {
    console.error("DB'den event getirme hatası:", error);
    return null;
  }
}

export default async function EventDetailPage({ params }) {
  // Slug değerini doğrudan params'tan alalım
  const { slug } = params;
  
  // Önce veritabanından deneyelim
  const event = await getEventBySlug(slug);

  // Eğer etkinlik bulunamadıysa 404 sayfasına yönlendir
  if (!event) return notFound();

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Eventbild */}
          <div className="relative w-full h-72 md:h-[400px]">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-800 to-pink-700 flex items-center justify-center">
                <span className="text-white text-xl">Kein Bild verfügbar</span>
              </div>
            )}
          </div>

          {/* Eventinfos */}
          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              {event.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-pink-100 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString("de-DE")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4" />
                {event.price === 0 ? "Kostenlos / Spende" : `${event.price} €`}
              </div>
            </div>

            <p className="text-lg text-white">{event.shortDescription}</p>

            <p className="text-sm text-gray-300 border-t border-pink-500 pt-4 leading-relaxed">
              {event.longDescription}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Zurück-Button */}
              <Link href="/events">
                <button className="flex items-center justify-center gap-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full transition duration-300 cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                  Zurück zur Übersicht
                </button>
              </Link>

              {/* Button zur Ticketseite */}
              <Link href={`/events/${event.slug}/tickets`}>
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition duration-300 cursor-pointer">
                  Jetzt Ticket sichern
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}