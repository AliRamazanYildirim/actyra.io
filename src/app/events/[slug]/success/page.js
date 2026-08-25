import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TicketDetails from "@/components/TicketDetails";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

async function getEventBySlug(slug) {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });
    return event ? JSON.parse(JSON.stringify(event)) : null;
  } catch (error) {
    console.error("Fehler beim Abrufen des Events aus der Datenbank:", error);
    return null;
  }
}

export default async function TicketSuccessPage({ params, searchParams }) {
  params = await params;
  searchParams = await searchParams;

  const slug = params.slug;
  const name = searchParams.name || "Teilnehmer";
  const email = searchParams.email || "kunde@example.com";
  const eventTitle = searchParams.title || "Event";
  const quantity = searchParams.quantity || "1";
  const totalAmount = searchParams.totalAmount || "0";
  const orderNumber = searchParams.orderNumber || "wird geladen...";

  let event = await getEventBySlug(slug);

  if (!event) {
    event = eventSeedData.find((e) => e.slug === slug);
    if (!event) {
      return notFound();
    }
  }

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="p-8 sm:p-10 text-center space-y-4 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Buchung erfolgreich!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vielen Dank für deine Bestellung und deinen sozialen Beitrag.
            </p>
          </div>
        </div>

        {/* Details Component */}
        <div className="p-6 sm:p-10 space-y-8">
          <TicketDetails
            name={name}
            email={email}
            eventTitle={eventTitle}
            quantity={quantity}
            totalAmount={totalAmount}
            orderNumber={orderNumber}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/profil"
              className="flex-1 py-3 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Zu meinen Tickets
            </Link>

            <Link
              href="/"
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Zur Startseite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
