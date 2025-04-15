import { notFound } from "next/navigation";
import eventsData from "@/data/events";
import TicketSelector from "@/components/TicketSelector";
import NavBar from "@/components/NavBar";

export default function TicketBookingPage({ params }) {
  const event = eventsData.find((e) => e.slug === params.slug);

  if (!event) return notFound();

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-white px-6 py-20 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-pink-600">
          🎟️ Ticket buchen für: {event.title}
        </h1>

        <p className="text-gray-700 mb-8">{event.shortDescription}</p>

        <TicketSelector price={event.price} title={event.title} />
      </main>
    </>
  );
}
