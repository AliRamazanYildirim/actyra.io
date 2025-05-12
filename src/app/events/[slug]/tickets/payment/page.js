"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import useTicketStore from "@/store/ticketStore";

export default function CheckoutPage() {
  const router = useRouter();
  const tickets = useTicketStore(state => state.tickets);
  const resetTicketState = useTicketStore(state => state.resetTicketState);

  const [form, setForm] = useState({
    name: "",
    email: "",
    method: "paypal",
  });

  const isValid = form.name && form.email;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMethodSelect = (method) => {
    setForm({ ...form, method });
  };

    const handleSubmit = () => {
    // Falls keine Tickets vorhanden sind, zurück zur Hauptseite
    if (!tickets || tickets.length === 0) {
      router.push('/');
      return;
    }
  
    // Das erste Ticket für den Routing-Pfad verwenden
    const firstTicket = tickets[0];
    
    // Query-Parameter erstellen
    const queryParams = new URLSearchParams({
      name: form.name,
      email: form.email,
      title: firstTicket.eventTitle,
      quantity: tickets.reduce((sum, t) => sum + t.quantity, 0),
      paymentMethod: form.method,
      totalAmount: (totalPrice + totalDonation).toString()
    }).toString();
    
    // Warenkorb zurücksetzen
    resetTicketState();
    
    // Zur Erfolgsseite navigieren
    router.push(`/events/${firstTicket.slug}/success?${queryParams}`);
  };

  const totalPrice = tickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalDonation = tickets.reduce((sum, t) => sum + t.totalDonation, 0);
  const total = totalPrice + totalDonation;

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">Zahlung für alle Tickets</h1>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Dein Name"
              value={form.name}
              onChange={handleChange}
              className="ticket-input placeholder:text-gray-600"
            />
            <input
              type="email"
              name="email"
              placeholder="E-Mail-Adresse"
              value={form.email}
              onChange={handleChange}
              className="ticket-input placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Zahlungsart:</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "paypal", label: "PayPal" },
                { id: "creditcard", label: "Kreditkarte" },
                { id: "bank", label: "Banküberweisung" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer px-4 py-2 rounded border ${
                    form.method === method.id
                      ? "bg-pink-600 border-pink-400"
                      : "bg-gray-800 border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={form.method === method.id}
                    onChange={() => handleMethodSelect(method.id)}
                    className="hidden"
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>

          <div className="text-right text-xl font-bold">
            Gesamtsumme: {total} €
          </div>

          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`ticket-button cursor-pointer ${
              isValid ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Jetzt kostenpflichtig bestellen
          </button>
        </div>
      </main>
    </>
  );
}