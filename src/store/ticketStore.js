import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets: [], // Array für mehrere Event-Tickets
      ticketCount: 1, // Standardwert für aktuelle Ticket-Auswahl
      
      // Ticket-Counter setzen
      setTicketCount: (count) => set({ ticketCount: count }),
      
      // Event zum Warenkorb hinzufügen
      addTicket: (eventDetails) => {
        const { tickets } = get();
        const existingIndex = tickets.findIndex(t => t.slug === eventDetails.slug);
        
        if (existingIndex >= 0) {
          // Event bereits im Warenkorb, aktualisieren
          const updatedTickets = [...tickets];
          updatedTickets[existingIndex] = {
            ...updatedTickets[existingIndex],
            quantity: updatedTickets[existingIndex].quantity + eventDetails.quantity,
            totalPrice: (updatedTickets[existingIndex].quantity + eventDetails.quantity) * eventDetails.price,
            totalDonation: (updatedTickets[existingIndex].quantity + eventDetails.quantity) * eventDetails.donation,
          };
          set({ tickets: updatedTickets });
        } else {
          // Neues Event hinzufügen
          set({ tickets: [...tickets, eventDetails] });
        }
      },
      
      // Event aus Warenkorb entfernen
      removeTicket: (slug) => {
        const { tickets } = get();
        set({ tickets: tickets.filter(t => t.slug !== slug) });
      },
      
      // Gesamtzahl der Tickets berechnen
      getTotalTicketCount: () => {
        return get().tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      },
      
      // Warenkorb zurücksetzen
      resetTicketState: () => set({ 
        tickets: [],
        ticketCount: 1 // Ticket-Counter zurücksetzen
      }),
    }),
    {
      name: 'ticket-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTicketStore;