"use client";

import dynamic from "next/dynamic";
import { generateTicketPdf } from "@/lib/generateTicketPdf";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

export default function TicketDetails({ name, email, eventTitle, quantity, totalAmount, orderNumber }) {
  return (
    <div className="space-y-6">
      {/* Bestellnummer */}
      <p className="text-gray-300 text-lg">
        Deine Bestellnummer:{" "}
        <span className="font-bold text-white">{orderNumber}</span>
      </p>
      
      {/* Event-Details */}
      <div className="bg-transparent p-4 rounded-lg">
        <p className="text-lg"><span className="font-semibold">Event:</span> {eventTitle}</p>
        <p className="text-lg"><span className="font-semibold">Anzahl Tickets:</span> {quantity}</p>
        <p className="text-lg"><span className="font-semibold">Gesamtbetrag:</span> {totalAmount} €</p>
      </div>

      {/* QR Code */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Ihr Ticket</h2>
        <div className="bg-white p-4 rounded-xl inline-block">
          <QRCode value={`ticket-${orderNumber}`} />
        </div>
      </div>

      {/* Hinweis */}
      <p className="text-lg text-white font-semibold mt-6">
        Dein Ticket haben wir soeben an <span className="text-pink-400">{email}</span> versendet.
      </p>

      <button
        onClick={() =>
          generateTicketPdf({ name, eventTitle, orderNumber })
        }
        className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-full transition cursor-pointer"
      >
        🎫 PDF herunterladen
      </button>
    </div>
  );
}