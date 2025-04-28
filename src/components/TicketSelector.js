"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketSelector({ price = 10, title = "Event", slug }) {
  const [quantity, setQuantity] = useState(1);
  const donation = price === 0 ? 2 : 3;
  const router = useRouter();

  const totalPrice = quantity * price;
  const totalDonation = quantity * donation;

  const handleCheckout = () => {
    router.push(
      `/events/${slug}/tickets/payment?quantity=${quantity}&price=${price}&donation=${donation}`
    );
  };

  return (
    <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6 mt-16">
      <h2 className="ticket-heading">Tickets buchen</h2>

      <label htmlFor="quantity" className="ticket-label">Anzahl der Tickets</label>
      <input
        id="quantity"
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="ticket-input"
      />

      <p className="ticket-summary">
        Preis pro Ticket: {price === 0 ? "Kostenlos" : `${price} €`}
      </p>
      <p className="ticket-summary">
        Spendenanteil pro Ticket: {donation} €
      </p>

      <div className="ticket-total">
        Gesamt: {price === 0
          ? `${totalDonation} € Spende`
          : `${totalPrice} € + ${totalDonation} € Spende`}
      </div>

      <button
        onClick={handleCheckout}
        className="ticket-button"
      >
        Weiter zur Bezahlung
      </button>
    </div>
  );
}
