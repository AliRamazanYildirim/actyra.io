"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTicketStore from "@/store/ticketStore";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin, 
  ShieldCheck 
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function TicketSelector({
  price = 10,
  title = "Event",
  slug,
  location,
  imageUrl,
  date,
  shortDescription,
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const [ticketCount, setTicketCount] = useState(1);

  const donation = price === 0 ? 2 : 3;
  const totalPrice = ticketCount * price;
  const totalDonation = ticketCount * donation;
  const grandTotal = totalPrice + totalDonation;

  const handleIncrement = () => setTicketCount((prev) => prev + 1);
  const handleDecrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleCheckout = () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    try {
      const ticketData = {
        eventTitle: title,
        quantity: ticketCount,
        price: price,
        donation: donation,
        totalPrice: totalPrice,
        totalDonation: totalDonation,
        slug: slug,
        date: date || new Date().toISOString().split("T")[0],
        location: location || "Ort folgt",
        imageUrl: imageUrl || "/images/event-default.webp",
      };

      useTicketStore.getState().addToCart(ticketData);
      router.push("/warenkorb");
    } catch (error) {
      console.error("Fehler beim Ticket-Hinzufügen:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      {/* Event Header Banner */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-900 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-800 to-pink-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
            Ticket-Konfiguration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold line-clamp-1">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                {location}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {new Date(date).toLocaleDateString("de-DE")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Quantity Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-base font-bold text-slate-900 dark:text-white block">
              Anzahl der Tickets
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Wähle wie viele Tickets du bestellen möchtest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={ticketCount <= 1}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Ticket verringern"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-12 text-center text-xl font-extrabold text-slate-900 dark:text-white">
              {ticketCount}
            </span>

            <button
              onClick={handleIncrement}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Ticket erhöhen"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pricing & Donation Breakdown */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              Ticketpreis ({ticketCount}x {price === 0 ? "Kostenlos" : `${price} €`})
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {totalPrice} €
            </span>
          </div>

          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              Automatischer Spendenanteil ({ticketCount}x {donation} €)
            </span>
            <span className="font-bold">+{totalDonation} €</span>
          </div>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-2" />

          <div className="flex justify-between items-baseline text-lg font-bold text-slate-900 dark:text-white pt-1">
            <span>Gesamtbetrag</span>
            <span className="text-2xl text-pink-600 dark:text-pink-400 font-extrabold">
              {grandTotal} €
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Zurück</span>
          </button>

          <button
            onClick={handleCheckout}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>In den Warenkorb ({grandTotal} €)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SSL Verschlüsselt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>100% verifizierter Spendenimpact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
