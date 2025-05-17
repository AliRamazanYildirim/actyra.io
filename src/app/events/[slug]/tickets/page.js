import { notFound } from "next/navigation";
import eventSeedData from "@/data/eventSeedData";
import TicketSelector from "@/components/TicketSelector";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import dbConnect from "@/lib/db";
import Image from "next/image";
import Event from "@/models/Event";

// Hilfsfunktion zum Abrufen des Events aus der Datenbank
async function getEventBySlug(slug) {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });
    return event ? JSON.parse(JSON.stringify(event)) : null;
  } catch (error) {
    console.error("Fehler beim Abrufen des Events aus der Datenbank:", error);
    return null;
  }
}

export default async function TicketBookingPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  // Versuche zuerst, das Event aus der Datenbank zu laden
  let event = await getEventBySlug(slug);

  // Wenn nicht in der Datenbank gefunden, versuche es mit den Seed-Daten
  if (!event) {
    console.log(`Event ${slug} nicht in DB gefunden, suche in Seed-Daten`);
    event = eventSeedData.find((e) => e.slug === slug);

    if (!event) {
      console.log(`Event ${slug} auch nicht in Seed-Daten gefunden`);
      return notFound();
    }
    console.log(`Event ${slug} in Seed-Daten gefunden`);
  } else {
    console.log(`Event ${slug} in DB gefunden`);
  }

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* ✅ Kasten */}
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Eventbild */}
          <div className="relative w-full h-60 md:h-80">
            <Image
              src={event.imageUrl || "/images/default-event.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Inhalt */}
          <div className="p-8 space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text text-center">
              🎟️ Ticket buchen für: {event.title}
            </h1>

            <p className="text-gray-300 text-center">
              {event.shortDescription}
            </p>

            {/* TicketSelector in neuer Box */}
            <div className="mt-10">
              <TicketSelector
                price={event.price}
                title={event.title}
                slug={event.slug}
                date={event.date}
                location={event.location}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
