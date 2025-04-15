import { notFound } from "next/navigation";
import eventsData from "@/data/events";
import TicketSelector from "@/components/TicketSelector";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import Image from "next/image";

export default function TicketBookingPage({ params }) {
  const event = eventsData.find((e) => e.slug === params.slug);
  if (!event) return notFound();

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16 max-w-4xl mx-auto">
        {/* Eventbild */}
        <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden shadow-xl mb-10">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Titel + Beschreibung */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            🎟️ Ticket buchen für: {event.title}
          </h1>
          <p className="text-gray-300 mt-2">{event.shortDescription}</p>
        </div>

        {/* ✅ TicketSelector mit slug */}
        <TicketSelector
          price={event.price}
          title={event.title}
          slug={event.slug}
        />
      </main>
    </>
  );
}
