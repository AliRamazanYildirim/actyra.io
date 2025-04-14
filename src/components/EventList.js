// src/components/EventList.jsx

"use client";

import Image from "next/image";
import { Calendar, MapPin, Tag } from "lucide-react";

export default function EventList({ events }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {events.map((event, index) => (
        <div
          key={index}
          className="group border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="relative w-full h-56">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="text-xl font-semibold text-pink-600">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <Tag className="w-4 h-4" />
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-right text-sm text-pink-500 font-semibold">
              {event.price > 0 ? `${event.price} €` : "Kostenlos"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
