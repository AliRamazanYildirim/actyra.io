'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useTicketStore from "@/store/ticketStore";
import NavBar from "@/components/NavBar";
import { Trash2, ShoppingBag, ChevronLeft, Plus, Minus } from "lucide-react"; // Plus und Minus Icons hinzugefügt
import Link from "next/link";

export default function WarenkorbPage() {
  const router = useRouter();
  const cartTickets = useTicketStore(state => state.cartTickets);
  const removeFromCart = useTicketStore(state => state.removeFromCart);
  const updateTicketQuantity = useTicketStore(state => state.updateTicketQuantity);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Verhindern von Hydratationsfehlern
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setIsLoading(false);
      // Umleitung entfernt - stattdessen zeigen wir die leere Warenkorb-Meldung
    }
  }, [cartTickets, router, isMounted]);

  // Ticket-Menge erhöhen
  const increaseQuantity = (slug) => {
    const ticket = cartTickets.find(t => t.slug === slug);
    if (ticket) {
      updateTicketQuantity(slug, ticket.quantity + 1);
    }
  };

  // Ticket-Menge verringern, mindestens 1
  const decreaseQuantity = (slug) => {
    const ticket = cartTickets.find(t => t.slug === slug);
    if (ticket && ticket.quantity > 1) {
      updateTicketQuantity(slug, ticket.quantity - 1);
    }
  };

  // Während des Server-Renderings oder wenn nicht gemounted ist, zeige Ladeindikator
  if (!isMounted || isLoading) return <div>Lädt...</div>;
  
  // Leerer Warenkorb UI statt null oder Umleitung
  if (!cartTickets || cartTickets.length === 0) {
    return (
      <>
        <NavBar />
        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 mt-10">
            <h1 className="text-3xl font-extrabold text-center text-white mb-8">
              Mein Warenkorb
            </h1>
            
            <div className="py-12 flex flex-col items-center">
              <ShoppingBag size={64} className="text-pink-500 opacity-50 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Dein Warenkorb ist leer</h2>
              <p className="text-gray-400 mb-8 text-center">
                Du hast noch keine Tickets zu deinem Warenkorb hinzugefügt.
              </p>
              <Link href="/events">
                <button className="mt-4 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer">
                  Events entdecken
                </button>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Gesamtsumme für alle Events berechnen
  const totalPrice = cartTickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0);
  const totalDonation = cartTickets.reduce((sum, ticket) => sum + ticket.totalDonation, 0);

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 mt-10">
          <h1 className="text-3xl font-extrabold text-center text-white mb-8">
            Mein Warenkorb
          </h1>

          {/* Liste aller Events */}
          {cartTickets.map((ticket) => (
            <div
              key={ticket.slug}
              className="mb-8 border-b border-pink-500 pb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{ticket.eventTitle}</h2>
                <button
                  onClick={() => removeFromCart(ticket.slug)}
                  className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full transition-colors cursor-pointer"
                  title="Event entfernen"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="mb-2 flex items-center">
                <span className="mr-2">📅</span> Datum: {ticket.date}
              </p>
              <p className="mb-2 flex items-center">
                <span className="mr-2">📍</span> Ort: {ticket.location}
              </p>
              
              {/* Ticket-Mengensteuerung */}
              <div className="mb-2 flex items-center">
                <span className="mr-2">🎟️</span> Anzahl Tickets:{" "}
                <div className="flex items-center ml-2 border border-gray-600 rounded-md">
                  <button 
                    onClick={() => decreaseQuantity(ticket.slug)} 
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-l-md transition-colors cursor-pointer flex items-center justify-center"
                    disabled={ticket.quantity <= 1}
                  >
                    <Minus size={16} className={ticket.quantity <= 1 ? "text-gray-500" : "text-white"} />
                  </button>
                  <span className="px-4 py-1 bg-gray-800">{ticket.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(ticket.slug)} 
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-r-md transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <p className="mb-2 flex items-center">
                <span className="mr-2">💶</span> Preis pro Ticket:{" "}
                {ticket.price === 0 ? "Kostenlos" : `${ticket.price} €`}
              </p>
              <p className="mb-2 flex items-center">
                <span className="mr-2">🤝</span> Spende pro Ticket:{" "}
                {ticket.donation} €
              </p>
              <p className="text-right mt-2 font-semibold">
                Zwischensumme: {ticket.totalPrice + ticket.totalDonation} €
              </p>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            <p className="mb-2 flex items-center justify-end">
              <span className="mr-2">💰</span> Gesamtsumme:{" "}
              {totalPrice + totalDonation} €
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              Zurück
            </button>

            <button
              onClick={() => {
                // Falls Tickets vorhanden sind, zur Zahlungsseite weiterleiten
                cartTickets && cartTickets.length > 0
                  ? router.push(`/events/${cartTickets[0].slug}/tickets/payment`)
                  : router.push("/");
              }}
              className="ticket-button cursor-pointer"
            >
              Zur Zahlung
            </button>
          </div>
        </div>
      </main>
    </>
  );
}