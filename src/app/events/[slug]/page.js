import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Euro, 
  ChevronLeft, 
  Heart, 
  ShieldCheck, 
  Ticket, 
  Sparkles,
  ArrowRight,
  Share2
} from "lucide-react";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventSeedData from "@/data/eventSeedData";

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

export default async function EventDetailPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  let event = await getEventBySlug(slug);

  if (!event) {
    event = eventSeedData.find((e) => e.slug === slug);
    if (!event) {
      return notFound();
    }
  }

  const donationAmount = event.price === 0 ? 2 : 3;

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </Link>

        {event.category && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 capitalize">
            {event.category.replace("-", " ")}
          </span>
        )}
      </div>

      {/* Main Grid: Left Details (Span 7-8), Right Sticky Checkout Card (Span 4-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Event Media & Detailed Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Hero Image */}
          <div className="relative w-full h-72 sm:h-96 md:h-[460px] rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-800 to-pink-700 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{event.title}</span>
              </div>
            )}

            {/* Gradient Overlay for bottom text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-pink-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Key Information Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Datum</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {new Date(event.date).toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Veranstaltungsort</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {event.location || "Wird bekanntgegeben"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Spendenanteil</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {donationAmount} € pro Ticket
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Über dieses Event
            </h2>

            {event.shortDescription && (
              <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {event.shortDescription}
              </p>
            )}

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800/80 pt-6">
              {event.longDescription || "Detaillierte Informationen zum Ablauf und Line-Up folgen in Kürze."}
            </div>

            {/* Social Impact Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-500/20 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-pink-500 text-white shrink-0 mt-0.5">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Dein Ticket verändert die Welt
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Mit jedem Kauf wird automatisch ein fester Betrag von {donationAmount} € an gemeinnützige Initiativen gespendet. Transparent, direkt und ohne Extrakosten.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ticketpreis
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {event.price === 0 ? "Kostenlos" : `${event.price} €`}
                </span>
                {event.price > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / Person
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Inkl. Spendenbeitrag:</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">+{donationAmount} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verfügbarkeit:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Tickets verfügbar</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ticket-Typ:</span>
                <span className="font-semibold">Digitaler QR-Code</span>
              </div>
            </div>

            {/* Main CTA */}
            <Link
              href={`/events/${event.slug}/tickets`}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Ticket className="w-5 h-5" />
              <span>Jetzt Ticket buchen</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            {/* Trust features */}
            <div className="space-y-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-500" />
                <span>Sichere Bezahlung über Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Sofortige Ticketzustellung per E-Mail</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
