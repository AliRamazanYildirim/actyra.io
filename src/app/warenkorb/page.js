"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useTicketStore from "@/store/ticketStore";
import {
  Trash2,
  ShoppingBag,
  ChevronLeft,
  Plus,
  Minus,
  Calendar,
  MapPin,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function WarenkorbPage() {
  const router = useRouter();
  const cartTickets = useTicketStore((state) => state.cartTickets);
  const removeFromCart = useTicketStore((state) => state.removeFromCart);
  const updateTicketQuantity = useTicketStore(
    (state) => state.updateTicketQuantity,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const increaseQuantity = (slug) => {
    const ticket = cartTickets.find((t) => t.slug === slug);
    if (ticket) {
      updateTicketQuantity(slug, ticket.quantity + 1);
    }
  };

  const decreaseQuantity = (slug) => {
    const ticket = cartTickets.find((t) => t.slug === slug);
    if (ticket && ticket.quantity > 1) {
      updateTicketQuantity(slug, ticket.quantity - 1);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen py-32 px-4 max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3 animate-pulse" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  // Empty cart
  if (!cartTickets || cartTickets.length === 0) {
    return (
      <div className="min-h-screen py-28 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Dein Warenkorb ist leer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Du hast aktuell keine Tickets in deinem Warenkorb. Entdecke
              inspirierende Events und tue gleichzeitig Gutes!
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Events entdecken</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = cartTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0,
  );
  const totalDonation = cartTickets.reduce(
    (sum, ticket) => sum + ticket.donation * ticket.quantity,
    0,
  );
  const grandTotal = totalPrice + totalDonation;

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Mein{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Warenkorb
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Überprüfe deine Ticket-Auswahl vor der verbindlichen Buchung.
        </p>
      </div>

      {/* Grid: Tickets List (Span 8) + Summary (Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tickets List */}
        <div className="lg:col-span-8 space-y-4">
          {cartTickets.map((ticket) => (
            <div
              key={ticket.slug}
              className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {ticket.imageUrl && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Image
                        src={ticket.imageUrl}
                        alt={ticket.eventTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {ticket.eventTitle}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        {ticket.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        {ticket.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(ticket.slug)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-end sm:self-auto cursor-pointer"
                  title="Event entfernen"
                  aria-label="Event entfernen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Pricing & Stepper Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {/* Stepper */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
                    Menge:
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => decreaseQuantity(ticket.slug)}
                      disabled={ticket.quantity <= 1}
                      className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-900 dark:text-white">
                      {ticket.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(ticket.slug)}
                      className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {ticket.quantity}x{" "}
                    {ticket.price === 0 ? "Kostenlos" : `${ticket.price} €`} +{" "}
                    {ticket.quantity}x {ticket.donation} € Spende
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {(ticket.price + ticket.donation) * ticket.quantity} €
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-500 pt-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Weitere Events hinzufügen</span>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Zusammenfassung
            </h2>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>
                  Tickets ({cartTickets.reduce((s, t) => s + t.quantity, 0)}{" "}
                  Stück)
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {totalPrice} €
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Gemeinnützige Spende
                </span>
                <span className="font-bold">+{totalDonation} €</span>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              <div className="flex justify-between items-baseline text-lg font-bold text-slate-900 dark:text-white">
                <span>Gesamtsumme</span>
                <span className="text-2xl text-pink-600 dark:text-pink-400 font-extrabold">
                  {grandTotal} €
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={() => {
                if (cartTickets && cartTickets.length > 0) {
                  router.push(`/events/${cartTickets[0].slug}/tickets/payment`);
                }
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Zur sicheren Zahlung</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="space-y-2 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% sichere 256-Bit SSL Verschlüsselung</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Spendenquittung auf Wunsch erhältlich</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
