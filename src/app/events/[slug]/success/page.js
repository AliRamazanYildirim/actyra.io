"use client";

import { notFound, useSearchParams } from "next/navigation";
import eventSeedData from "@/data/eventSeedData";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import { generateTicketPdf } from "@/lib/generateTicketPdf";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

export default function TicketSuccessPage({ params }) {
  // state für die Bestellnummer
  // params auflösen mit React.use()
  const [orderNumber, setOrderNumber] = useState("wird geladen...");
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Teilnehmer";
  const eventTitle = searchParams.get("title") || "Event";

  const resolvedParams = use(params);

  // Bestellnummer erst nach der Hydration generieren
  useEffect(() => {
    const randomOrderNumber = `BNR${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    setOrderNumber(randomOrderNumber);
  }, []);

  const event = eventSeedData.find((e) => e.slug === resolvedParams.slug);
  if (!event) return notFound();

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Eventbild */}
          <div className="relative w-full h-72 md:h-[400px]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Inhalt */}
          <div className="p-8 space-y-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              🎉 Buchung erfolgreich!
            </h1>

            {/* Bestellnummer */}
            <p className="text-gray-300 text-lg">
              Deine Bestellnummer:{" "}
              <span className="font-bold text-white">{orderNumber}</span>
            </p>

            {/* QR Code */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Ihr Ticket</h2>
              <div className="bg-white p-4 rounded-xl inline-block">
                <QRCode value="static-ticket-id" />
              </div>
            </div>

            {/* Hinweis - jetzt größer */}
            <p className="text-lg text-white font-semibold mt-6">
              Dein Ticket haben wir soeben an deine E-Mail-Adresse versendet.
            </p>

            <button
              onClick={() =>
                generateTicketPdf({ name, eventTitle, orderNumber })
              }
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-full transition cursor-pointer"
            >
              🎫 PDF herunterladen
            </button>

            {/* Zurück Button */}
            <div className="mt-6">
              <Link href="/">
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition duration-300 cursor-pointer">
                  Bild auswählen Zurück zur Startseite
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
