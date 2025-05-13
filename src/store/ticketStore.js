import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand Store mit Persistenz im localStorage für Tickets & Warenkorb-Logik
const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets: [], // Geladene oder gespeicherte Tickets
      isLoading: false, // Ladezustand für API-Aufrufe
      error: null, // Fehlerstatus

      // 🎟️ Tickets vom Server laden (nur eingeloggte Nutzer)
      fetchTickets: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/tickets", {
            credentials: "include", // Einschließlich Identitätsinformationen
          });
          if (!response.ok)
            throw new Error("Tickets konnten nicht geladen werden.");

          const data = await response.json();
          set({ tickets: data.tickets || [], isLoading: false });
        } catch (error) {
          console.error("Fehler beim Laden der Tickets:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      // 🎟️ Neues Ticket zur Datenbank hinzufügen (und in die Liste einfügen)
      addTicket: async (ticketData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(ticketData),
          });

          if (!response.ok) {
            // Erhalte die tatsächliche Fehlermeldung vom Server
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error ||
                `Ticket konnte nicht hinzugefügt werden (Status: ${response.status})`
            );
          }

          const data = await response.json();
          const newTicket = data.ticket;

          set((state) => ({
            tickets: [...state.tickets, newTicket],
            isLoading: false,
          }));

          return newTicket;
        } catch (error) {
          console.error("Fehler beim Hinzufügen des Tickets:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // 💰 Zahlungsabwicklung (funktioniert auch für nicht angemeldete Benutzer)
      processPayment: async (paymentData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error ||
                `Zahlung konnte nicht verarbeitet werden (Status: ${response.status})`
            );
          }

          const data = await response.json();
          set({ isLoading: false });
          return data;
        } catch (error) {
          console.error("Fehler bei der Zahlungsverarbeitung:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      

      // 🎟️ Ticket aus der Datenbank entfernen (z. B. Storno)
      removeTicket: async (ticketId) => {
        try {
          set({ isLoading: true, error: null });

          // URL wurde korrigiert - ticketId wird als Query-Parameter gesendet
          const response = await fetch(`/api/tickets?ticketId=${ticketId}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error || "Ticket konnte nicht gelöscht werden."
            );
          }

          set((state) => ({
            tickets: state.tickets.filter((t) => t._id !== ticketId),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Fehler beim Löschen des Tickets:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // 🛒 Ticket zum Warenkorb hinzufügen
      addToCart: (newTicket) =>
        set((state) => {
          const existing = state.tickets.find((t) => t.slug === newTicket.slug);
          if (existing) {
            return {
              tickets: state.tickets.map((t) =>
                t.slug === newTicket.slug
                  ? {
                      ...t,
                      quantity: t.quantity + newTicket.quantity,
                      totalPrice: t.price * (t.quantity + newTicket.quantity),
                      totalDonation: (t.totalDonation || 0) * (t.quantity + newTicket.quantity)
                    }
                  : t
              ),
            };
          } else {
            return { tickets: [...state.tickets, newTicket] };
          }
        }),

      // 🛒 Ticket aus dem Warenkorb entfernen (per slug)
      removeFromCart: (slug) =>
        set((state) => ({
          tickets: state.tickets.filter((t) => t.slug !== slug),
        })),

      // 🔁 Warenkorb oder geladene Tickets zurücksetzen
      resetTicketState: () => set({ tickets: [] }),

      // ✏️ Ticketmenge im Warenkorb anpassen
      updateTicketQuantity: (slug, newQuantity) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
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

      // ❌ Fehlerstatus manuell zurücksetzen
      clearError: () => set({ error: null }),
    }),
    {
      name: "actyra-ticket-store",
      getStorage: () => localStorage,
    }
  )
);

export default useTicketStore;
