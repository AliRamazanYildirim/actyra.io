import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand Store ile sepet mantığı
const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets: [],
      isLoading: false,
      error: null,

      // Sepete ürün ekleme
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
                      totalDonation: t.donation * (t.quantity + newTicket.quantity),
                    }
                  : t
              ),
            };
          } else {
            return { tickets: [...state.tickets, newTicket] };
          }
        }),

      // Sepetten ürün çıkarma
      removeFromCart: (slug) =>
        set((state) => ({
          tickets: state.tickets.filter((t) => t.slug !== slug),
        })),

      // Sepeti sıfırlama
      resetTicketState: () => set({ tickets: [] }),

      // Ürün miktarını güncelleme
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

      // Hata durumunu temizleme
      clearError: () => set({ error: null }),
    }),
    {
      name: "actyra-ticket-store",
      getStorage: () => localStorage,
    }
  )
);

export default useTicketStore;