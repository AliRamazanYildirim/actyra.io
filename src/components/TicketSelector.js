"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTicketStore from "@/store/ticketStore";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function TicketSelector({
  price = 10,
  title = "Event",
  slug,
  location,
  imageUrl,
}) {
  const { addTicket } = useTicketStore();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth(); // Auth-Status einbinden

  // Lokaler State für die Ticketanzahl (statt aus dem Store zu versuchen)
  const [ticketCount, setTicketCount] = useState(1);

  // Lokaler State für das Input-Feld
  const [inputValue, setInputValue] = useState("1");

  const donation = price === 0 ? 2 : 3;
  const totalPrice = ticketCount * price;
  const totalDonation = ticketCount * donation;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setTicketCount(0);
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) setTicketCount(parsed);
    }
  };

  const handleCheckout = () => {
    if (!isLoaded) return;

    // Prüfen, ob der User eingeloggt ist
    if (!isSignedIn) {
      // Falls nicht, zur Login-Seite navigieren
      router.push("/sign-in");
      return;
    }

    try {
      // Einfacherer Ansatz: Ticket zum lokalen Warenkorb hinzufügen
      // anstatt sofort API-Anfrage zu senden
      const ticketData = {
        eventTitle: title,
        quantity: ticketCount,
        price: price,
        donation: donation,
        totalPrice: totalPrice,
        totalDonation: totalDonation,
        slug: slug,
        date: new Date().toISOString().split("T")[0], // ✔ ISO format
        location: location,
        imageUrl: imageUrl,
      };

      // Verwende addToCart statt addTicket
      useTicketStore.getState().addToCart(ticketData);

      // Zur Warenkorbseite navigieren
      router.push("/warenkorb");
    } catch (error) {
      console.error("Fehler beim Ticket-Hinzufügen:", error);
      alert(
        "Das Ticket konnte nicht hinzugefügt werden. Bitte versuchen Sie es später erneut."
      );
    }
  };

  return (
    <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6 mt-16">
      {/* Event Görseli Ekleme */}
      {imageUrl && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              console.error("Image load error for:", imageUrl);
              e.target.src = "/images/event-default.webp";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-300">{location}</p>
          </div>
        </div>
      )}

      <h2 className="ticket-heading">Tickets buchen</h2>

      <label htmlFor="quantity" className="ticket-label">
        Anzahl der Tickets
      </label>
      <input
        id="quantity"
        type="number"
        min={1}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={(e) => e.target.select()} // Selektiert den Text bei Fokus
        onBlur={() => {
          if (ticketCount === 0) {
            setTicketCount(1);
            setInputValue("1");
          }
        }}
        className="ticket-input"
      />

      <p className="ticket-summary">
        Preis pro Ticket: {price === 0 ? "Kostenlos" : `${price} €`}
      </p>
      <p className="ticket-summary">Spendenanteil pro Ticket: {donation} €</p>

      <div className="ticket-total">
        Gesamt:{" "}
        {price === 0
          ? `${totalDonation} € Spende`
          : `${totalPrice} € + ${totalDonation} € Spende`}
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
          onClick={handleCheckout}
          className="ticket-button cursor-pointer"
        >
          Weiter zur Warenkorb
        </button>
      </div>
    </div>
  );
}
