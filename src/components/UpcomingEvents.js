import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import eventSeedData from "@/data/eventSeedData.js";
import { useUser } from "@clerk/nextjs";

export default function UpcomingEvents() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const { user } = useUser();
    
    useEffect(() => {
        if (user && eventSeedData && eventSeedData.length > 0) {
            // Verwenden Sie die anderen beiden Ereignisse als "kommende Ereignisse"
            setUpcomingEvents([
                {
                    ...eventSeedData[2],
                    id: eventSeedData[2].slug,
                    date: new Date(eventSeedData[2].date).toLocaleDateString("de-DE"),
                },
                {
                    ...eventSeedData[3],
                    id: eventSeedData[3].slug,
                    date: new Date(eventSeedData[3].date).toLocaleDateString("de-DE"),
                },
            ]);
        }
    }, [user]);

    return (
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Kommende Veranstaltungen</h2>

            {upcomingEvents.length === 0 ? (
                <div className="text-center py-10">
                    <Clock className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">
                        Sie haben keine geplanten kommenden Veranstaltungen.
                    </p>
                    <Link
                        href="/events"
                        className="mt-4 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer"
                    >
                        Veranstaltungen entdecken
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.slug || event.id}
                            className="flex flex-col md:flex-row gap-4 bg-gray-800/50 p-4 rounded-lg"
                        >
                            {event.imageUrl ? (
                                <div className="h-28 w-full md:w-40 relative rounded-lg overflow-hidden">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-28 w-full md:w-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        {event.title}
                                    </span>
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <span className="text-pink-400 font-medium">
                                        Tickets verfügbar
                                    </span>
                                </div>

                                <div className="mt-2 text-sm text-gray-300 flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {event.date}
                                </div>

                                <div className="mt-1 text-sm text-gray-300 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Link href={`/events/${event.slug || event.id}`}>
                                        <Button className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer">
                                            Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}