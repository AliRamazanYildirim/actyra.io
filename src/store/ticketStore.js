import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTicketStore = create(
  persist(
    (set, get) => ({
      cartTickets: [],         // Nur für Warenkorb
      purchasedTickets: [],    // Nur für "Meine Tickets"
      isLoading: false,
      error: null,

      // Gekaufte Tickets aus der Datenbank laden
      fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/tickets');
          if (!response.ok) {
            throw new Error('Fehler beim Laden der Tickets');
          }
          const data = await response.json();
          set({ purchasedTickets: data.tickets || [], isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Warenkorb: Ticket hinzufügen
      addToCart: (newTicket) =>
        set((state) => {
          const existing = state.cartTickets.find((t) => t.slug === newTicket.slug);
          if (existing) {
            return {
              cartTickets: state.cartTickets.map((t) =>
                t.slug === newTicket.slug
                  ? {
                      ...t,
                      quantity: t.quantity + newTicket.quantity,
                      totalPrice: t.price * (t.quantity + newTicket.quantity),
                      totalDonation: t.donation * (t.quantity + newTicket.quantity),
                    }
                  : t
              ),
            };
          } else {
            return { cartTickets: [...state.cartTickets, newTicket] };
          }
        }),

      // Warenkorb: Ticket entfernen
      removeFromCart: (slug) =>
        set((state) => ({
          cartTickets: state.cartTickets.filter((t) => t.slug !== slug),
        })),

      // Warenkorb: Zurücksetzen
      resetTicketState: () => set({ cartTickets: [] }),

      // Warenkorb: Anzahl aktualisieren
      updateTicketQuantity: (slug, newQuantity) =>
        set((state) => ({
          cartTickets: state.cartTickets.map((ticket) =>
            ticket.slug === slug
              ? {
                  ...ticket,
                  quantity: newQuantity,
                  totalPrice: ticket.price * newQuantity,
                  totalDonation: ticket.donation * newQuantity,
                }
              : ticket
          ),
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'actyra-ticket-store',
      getStorage: () => localStorage,
    }
  )
);

export default useTicketStore;
