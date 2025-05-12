import { notFound } from "next/navigation";
import eventsData from "@/data/events";
import TicketSelector from "@/components/TicketSelector";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import Image from "next/image";

export default async function TicketBookingPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const event = eventsData.find((e) => e.slug === resolvedParams.slug);
  if (!event) return notFound();

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
              src={event.imageUrl}
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

            <p className="text-gray-300 text-center">{event.shortDescription}</p>

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
