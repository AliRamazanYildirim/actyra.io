import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store mit Persist-Middleware für die Speicherung im localStorage
const useTicketStore = create(
  persist(
    (set) => ({
      tickets: [],

      // Ticket zum Warenkorb hinzufügen
      addTicket: (newTicket) => 
        set((state) => {
          // Prüfen, ob das Ticket bereits im Warenkorb ist
          const existingTicket = state.tickets.find(
            (t) => t.slug === newTicket.slug
          );

          if (existingTicket) {
            // Falls das Ticket bereits existiert, erhöhe die Menge
            return {
              tickets: state.tickets.map((ticket) =>
                ticket.slug === newTicket.slug
                  ? { 
                      ...ticket, 
                      quantity: ticket.quantity + newTicket.quantity,
                      totalPrice: ticket.price * (ticket.quantity + newTicket.quantity),
                      totalDonation: ticket.donation * (ticket.quantity + newTicket.quantity)
                    }
                  : ticket
              ),
            };
          } else {
            // Ansonsten füge das neue Ticket hinzu
            return {
              tickets: [...state.tickets, newTicket],
            };
          }
        }),

      // Ticket aus dem Warenkorb entfernen
      removeTicket: (slug) =>
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.slug !== slug),
        })),

      // Alle Tickets zurücksetzen (z.B. nach dem Kauf)
      resetTicketState: () => set({ tickets: [] }),
      
      // Neue Funktion: Ticketmenge aktualisieren
      updateTicketQuantity: (slug, newQuantity) => 
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.slug === slug
              ? { 
                  ...ticket, 
                  quantity: newQuantity,
                  totalPrice: ticket.price * newQuantity,
                  totalDonation: ticket.donation * newQuantity
                }
              : ticket
          ),
        })),
    }),
    {
      name: 'actyra-ticket-store', // Name für localStorage
    }
  )
);

export default useTicketStore;