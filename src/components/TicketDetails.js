"use client";

import dynamic from "next/dynamic";
import { generateTicketPdf } from "@/lib/generateTicketPdf";
import { Download, QrCode, Mail, Hash } from "lucide-react";

const QRCode = dynamic(
  () => import("react-qr-code").then((mod) => mod.default),
  { ssr: false }
);

export default function TicketDetails({
  name,
  email,
  eventTitle,
  quantity,
  totalAmount,
  orderNumber,
}) {
  return (
    <div className="space-y-6 text-center">
      {/* Order Number Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
        <Hash className="w-3.5 h-3.5 text-pink-500" />
        <span>Bestellnummer:</span>
        <span className="font-mono text-pink-600 dark:text-pink-400 font-bold">{orderNumber}</span>
      </div>

      {/* Ticket Details Summary Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 text-left space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Veranstaltung:</span>
          <span className="font-bold text-slate-900 dark:text-white">{eventTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Ticket-Inhaber:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Anzahl Tickets:</span>
          <span className="font-bold text-slate-900 dark:text-white">{quantity}x</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Bezahlter Betrag:</span>
          <span className="font-extrabold text-pink-600 dark:text-pink-400">{totalAmount} €</span>
        </div>
      </div>

      {/* QR Code */}
      <div className="space-y-3 pt-2">
        <div className="p-4 bg-white rounded-2xl inline-block shadow-lg border border-slate-200">
          <QRCode value={`ticket-${orderNumber}`} size={160} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Zeige diesen QR-Code am Einlass der Veranstaltung vor.
        </p>
      </div>

      {/* Email note */}
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <Mail className="w-4 h-4 text-pink-500 shrink-0" />
        <span>
          Dein digitales Ticket wurde an <strong className="text-slate-900 dark:text-white">{email}</strong> gesendet.
        </span>
      </div>

      {/* Download PDF CTA */}
      <div>
        <button
          onClick={() => generateTicketPdf({ name, eventTitle, orderNumber })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-pink-600 dark:hover:bg-pink-600 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Ticket als PDF herunterladen</span>
        </button>
      </div>
    </div>
  );
}
