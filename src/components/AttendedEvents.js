import Image from "next/image";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import eventSeedData from "@/data/eventSeedData.js";
import { useUser } from "@clerk/nextjs";

export default function AttendedEvents() {
    const [attendedEvents, setAttendedEvents] = useState([]);
    const { user } = useUser();
    
    useEffect(() => {
        if (user && eventSeedData && eventSeedData.length > 0) {
            // Verwende die ersten zwei Events als "besuchte Events"
            setAttendedEvents([
                {
                    ...eventSeedData[0],
                    id: eventSeedData[0].slug,
                    date: new Date(eventSeedData[0].date).toLocaleDateString("de-DE"),
                },
                {
                    ...eventSeedData[1],
                    id: eventSeedData[1].slug,
                    date: new Date(eventSeedData[1].date).toLocaleDateString("de-DE"),
                },
            ]);
        }
    }, [user]);

    return (
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Besuchte Veranstaltungen</h2>

            {attendedEvents.length === 0 ? (
                <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">
                        Sie haben noch an keiner Veranstaltung teilgenommen.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {attendedEvents.map((event) => (
                        <div
                            key={event.slug || event.id}
                            className="border border-gray-700 rounded-lg overflow-hidden"
                        >
                            <div className="h-40 relative">
                                <div className="absolute inset-0 bg-black/50 z-10">
                                    <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                                        Teilgenommen
                                    </div>
                                </div>
                                {event.imageUrl ? (
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {event.title}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{event.title}</h3>

                                <div className="mt-2 flex items-center text-sm text-gray-300">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {event.date}
                                </div>

                                <div className="mt-1 flex items-center text-sm text-gray-300">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}