import { notFound } from "next/navigation";
import eventSeedData from "@/data/eventSeedData";
import TicketSelector from "@/components/TicketSelector";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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

export default async function TicketBookingPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  let event = await getEventBySlug(slug);

  if (!event) {
    event = eventSeedData.find((e) => e.slug === slug);
    if (!event) {
      return notFound();
    }
  }

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        href={`/events/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Zurück zum Event</span>
      </Link>

      <TicketSelector
        price={event.price}
        title={event.title}
        slug={event.slug}
        date={event.date}
        location={event.location}
        imageUrl={event.imageUrl}
        shortDescription={event.shortDescription}
      />
    </div>
  );
}
