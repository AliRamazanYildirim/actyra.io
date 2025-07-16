import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";

// Kategorie-Icons importieren
import KategorieKulturMusik from "@/icons/KategorieKulturMusik";
import KategorieSportFreizeit from "@/icons/KategorieSportFreizeit";
import KategorieBildungWorkshop from "@/icons/KategorieBildungWorkshop";
import KategorieBusinessNetworking from "@/icons/KategorieBusinessNetworking";
import KategorieGesundheit from "@/icons/KategorieGesundheit";
import KategorieTechnologieInnovation from "@/icons/KategorieTechnologieInnovation";
import KategorieMessenAusstellungen from "@/icons/KategorieMessenAusstellungen";
import KategorieSonstigeEvents from "@/icons/KategorieSonstigeEvents";

// Kategorien-Array mit Slug, Icon und Name
const kategorien = [
  { slug: "kultur-musik", icon: KategorieKulturMusik, name: "Kultur & Musik" },
  { slug: "sport-freizeit", icon: KategorieSportFreizeit, name: "Sport & Freizeit" },
  { slug: "bildung-workshop", icon: KategorieBildungWorkshop, name: "Bildung & Workshop" },
  { slug: "business-networking", icon: KategorieBusinessNetworking, name: "Business & Networking" },
  { slug: "gesundheit", icon: KategorieGesundheit, name: "Gesundheit" },
  { slug: "technologie-innovation", icon: KategorieTechnologieInnovation, name: "Technologie & Innovation" },
  { slug: "messen-ausstellungen", icon: KategorieMessenAusstellungen, name: "Messen & Ausstellungen" },
  { slug: "sonstige-events", icon: KategorieSonstigeEvents, name: "Sonstige Events" },
];

// Diese Funktion wird zur Build-Zeit aufgerufen, um alle möglichen Pfade zu generieren
export async function generateStaticParams() {
  return kategorien.map((kategorie) => ({
    slug: kategorie.slug,
  }));
}

// Holt die Events für die jeweilige Kategorie
export async function getEvents(slug) {
  await dbConnect();
  
  try {
    // Holt die Events von der API, gefiltert nach Kategorie
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/events?category=${slug}`, { 
      cache: 'no-store' // Immer aktuelle Daten abrufen
    });
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Events');
    }
    
    const events = await response.json();
    console.log(`${slug}-Kategorie enthält ${events.length} Veranstaltungen`);
    return events;
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error);
    return [];
  }
}

export default async function KategoriePage({ params }) {
  // params muss für Next.js 14+ asynchron behandelt werden
  params = await params;
  const { slug } = params;
  
  const events = await getEvents(slug);
  
  // Wenn keine Events gefunden wurden oder der Slug ungültig ist
  if (!events) {
    notFound();
  }
  
  // Sucht die passende Kategorie-Information
  const kategorie = kategorien.find((k) => k.slug === slug);
  if (!kategorie && slug !== "sonstige-events") {
    notFound();
  }
  
  const IconComponent = kategorie?.icon;
  const kategorieName = kategorie?.name || "Sonstige Events";
  
  return (
    <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        {IconComponent && <IconComponent className="w-12 h-12 text-[#613583]" />}
        <h1 className="text-3xl md:text-4xl font-bold">
          {kategorieName}
        </h1>
      </div>
      
      <p className="mb-10 text-lg">
        Entdecke alle Events in der Kategorie{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-semibold">
          {kategorieName}
        </span>
      </p>
      
      {events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            Aktuell sind keine Events in dieser Kategorie verfügbar.
          </p>
          <Link href="/" className="mt-6 inline-block text-purple-600 hover:underline">
            Zurück zur Startseite
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link
              key={event._id.toString()}
              href={`/events/${event.slug}`}
              className="block bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {event.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
              
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{event.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(event.date).toLocaleDateString('de-DE', { 
                    day: '2-digit', month: '2-digit', year: 'numeric' 
                  })}
                </p>
                
                {event.shortDescription && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {event.shortDescription}
                  </p>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-semibold text-purple-600">
                    {event.price > 0 ? `${event.price.toFixed(2)} €` : 'Kostenlos'}
                  </span>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    Details ansehen
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}