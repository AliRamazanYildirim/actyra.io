import Link from "next/link";
import EventList from "@/components/EventList";
import { Ticket } from "lucide-react";
import useTicketStore from "@/store/ticketStore";
import eventSeedData from "@/data/eventSeedData.js";

export default function TicketsList() {
    // Daten aus dem Ticket-Store
    const tickets = useTicketStore((state) => state.purchasedTickets);
    const isLoading = useTicketStore((state) => state.isLoading);
    const error = useTicketStore((state) => state.error);
    const fetchTickets = useTicketStore((state) => state.fetchTickets);

    // Tickets in das Event-Format umwandeln
    const ticketsAsEvents = Array.isArray(tickets)
        ? tickets.map((ticket) => {
                // Passendes Event aus eventSeedData finden
                const matchingEvent = 
                    eventSeedData.find((event) => event.slug === ticket.slug) || {};

                return {
                    id: ticket._id || ticket.slug, // MongoDB-ID verwenden (falls vorhanden)
                    slug: ticket.slug,
                    title: ticket.eventTitle,
                    location: ticket.location,
                    date: ticket.date,
                    imageUrl:
                        ticket.imageUrl || 
                        matchingEvent.imageUrl || 
                        "/images/event-default.webp",
                    price: ticket.totalPrice,
                    pricePerTicket: ticket.price,
                    tags: [
                        "Ticket",
                        `${ticket.quantity}x`,
                        ticket.orderNumber ? `#${ticket.orderNumber.substring(0, 6)}` : "",
                    ],
                };
            })
        : [];

    return (
      <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Meine Tickets</h2>

        {/* Fehlermeldung */}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 mb-4 rounded-md">
            <p>
              Beim Laden der Tickets ist ein Fehler aufgetreten. Bitte versuchen
              Sie es erneut.
            </p>
            <button onClick={fetchTickets} className="text-sm underline mt-2">
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Ladezustand */}
        {isLoading ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Ihre Tickets werden geladen...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-10">
            <Ticket className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">
              Sie haben noch keine Tickets gekauft.
            </p>
            <Link
              href="/events"
              className="mt-4 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer"
            >
              Entdecken Sie Events
            </Link>
          </div>
        ) : (
          <EventList events={ticketsAsEvents} />
        )}
      </div>
    );
}