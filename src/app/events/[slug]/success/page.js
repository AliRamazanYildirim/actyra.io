import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import Image from "next/image";
import Link from "next/link";
import TicketDetails from "@/components/TicketDetails"; // Neue Client-Komponente
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData"; // Für Fallback

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

export default async function TicketSuccessPage({ params, searchParams }) {
  const slug = params.slug;
  const name = searchParams.name || "Teilnehmer";
  const email = searchParams.email || "kunde@example.com";
  const eventTitle = searchParams.title || "Event";
  const quantity = searchParams.quantity || "1";
  const totalAmount = searchParams.totalAmount || "0";
  const orderNumber = searchParams.orderNumber || "wird geladen...";
  
  console.log("DEBUG: URL-Parameter", {
    slug: slug,
    name, email, eventTitle, quantity, totalAmount, orderNumber
  });

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
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Eventbild */}
          <div className="relative w-full h-72 md:h-[400px]">
            <Image
              src={event.imageUrl || "/images/default-event.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Inhalt */}
          <div className="p-8 space-y-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              🎉 Buchung erfolgreich!
            </h1>

            {/* Client-Komponente für interaktive Elemente */}
            <TicketDetails 
              name={name}
              email={email}
              eventTitle={eventTitle}
              quantity={quantity}
              totalAmount={totalAmount}
              orderNumber={orderNumber}
            />

            {/* Zurück Button */}
            <div className="mt-6">
              <Link href="/">
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition duration-300 cursor-pointer">
                  Zurück zur Startseite
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}