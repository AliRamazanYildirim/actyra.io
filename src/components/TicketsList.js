import Link from "next/link";
import EventList from "@/components/EventList";
import { Ticket, Sparkles } from "lucide-react";
import useTicketStore from "@/store/ticketStore";
import eventSeedData from "@/data/eventSeedData.js";

export default function TicketsList() {
  const tickets = useTicketStore((state) => state.purchasedTickets);
  const isLoading = useTicketStore((state) => state.isLoading);
  const error = useTicketStore((state) => state.error);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);

  const ticketsAsEvents = Array.isArray(tickets)
    ? tickets.map((ticket) => {
        const matchingEvent =
          eventSeedData.find((event) => event.slug === ticket.slug) || {};

        return {
          id: ticket._id || ticket.slug,
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
    <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Meine gebuchten Tickets
        </h2>
        <span className="text-xs font-semibold text-pink-600 dark:text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">
          {ticketsAsEvents.length} {ticketsAsEvents.length === 1 ? "Ticket" : "Tickets"}
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm">
          <p>Beim Laden der Tickets ist ein Fehler aufgetreten.</p>
          <button onClick={fetchTickets} className="text-xs underline mt-1 font-semibold cursor-pointer">
            Erneut versuchen
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-pink-500 border-t-transparent mb-3"></div>
          <p className="text-xs text-slate-400">Tickets werden geladen...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              Du hast noch keine Tickets gekauft.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Entdecke Events in deiner Nähe und sichere dir jetzt deine Plätze.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Events entdecken</span>
          </Link>
        </div>
      ) : (
        <EventList events={ticketsAsEvents} />
      )}
    </div>
  );
}
