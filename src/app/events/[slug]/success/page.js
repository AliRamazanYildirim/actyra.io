import { notFound } from "next/navigation";
import eventsData from "@/data/events";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TicketSuccessPage({ params }) {
  const event = eventsData.find((e) => e.slug === params.slug);
  if (!event) return notFound();

  return (
    <>
      <NavBar />

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

        {/* Bestätigungstitel */}
        <div className="mb-10 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            🎉 Buchung erfolgreich!
          </h1>
          <p className="text-gray-300 mt-2">
            Du hast ein Ticket für{" "}
            <span className="font-semibold text-white">{event.title}</span> gebucht.
          </p>
        </div>

        {/* Ticketinfo-Box */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-sm text-gray-200 mb-8">
          <p><span className="font-bold text-white">🎟️ Ticket:</span> 1x Standard</p>
          <p><span className="font-bold text-white">💸 Spende:</span> 3 € für den guten Zweck</p>
          <p><span className="font-bold text-white">📅 Eventdatum:</span> {new Date(event.date).toLocaleDateString("de-DE")}</p>
          <p><span className="font-bold text-white">📍 Ort:</span> {event.location}</p>
        </div>

        {/* Button */}
        <div className="text-center">
          <Link href="/">
            <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition duration-300">
              Zurück zur Startseite
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
