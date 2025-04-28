// src/app/events/[slug]/page.js

import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Euro } from "lucide-react";

import NavBar from "@/components/NavBar";

import HeroDetailComp from "@/components/HeroDetailComp"; // 👈 Neue Hero-Komponente

// Events dynamisch laden
export async function generateStaticParams() {
  const mod = await import("@/data/events.js");
  const events = mod?.default || [];

  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }) {
  const mod = await import("@/data/events.js");
  const events = mod?.default || [];

  const event = events.find((e) => e.slug === params.slug);

  if (!event) return notFound();

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Bild */}
          <div className="relative w-full h-72 md:h-[400px]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Eventdetails */}
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

            <button className="mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition duration-300 cursor-pointer">
              Jetzt Ticket sichern
            </button>
          </div>
        </div>
      </main>

      
    </>
  );
}
