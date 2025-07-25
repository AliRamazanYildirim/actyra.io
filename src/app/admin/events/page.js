"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Event löschen möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventId));
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Events:", error);
    }
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);

    // Datum ohne Uhrzeit vergleichen
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (eventDateOnly.getTime() === nowDate.getTime()) {
      return {
        status: "active",
        label: "Aktiv",
        color: "bg-yellow-500/70 text-yellow-100",
      };
    } else if (eventDateOnly > nowDate) {
      return {
        status: "upcoming",
        label: "Bevorstehend",
        color: "bg-blue-500/70 text-blue-100",
      };
    } else {
      return {
        status: "completed",
        label: "Abgeschlossen",
        color: "bg-green-500/50 text-green-200",
      };
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter !== "all") {
      const eventStatus = getEventStatus(event.date);
      matchesStatus = eventStatus.status === statusFilter;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Event-Verwaltung</h1>
        <Link href="/admin/events/create">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Neues Event
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nach Event oder Ort suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Alle Kategorien</option>
            <option value="kultur-musik">Kultur & Musik</option>
            <option value="sport-freizeit">Sport & Freizeit</option>
            <option value="bildung-workshop">Bildung & Workshop</option>
            <option value="business-networking">Business & Networking</option>
            <option value="gesundheit">Gesundheit</option>
            <option value="technologie-innovation">
              Technologie & Innovation
            </option>
            <option value="messen-ausstellungen">Messen & Ausstellungen</option>
            <option value="sonstige-events">Sonstige Events</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Alle Status</option>
            <option value="upcoming">Bevorstehend</option>
            <option value="active">Aktiv</option>
            <option value="completed">Abgeschlossen</option>
          </select>

          <button className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white hover:bg-[#334155] transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Erweiterte Filter
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const eventStatus = getEventStatus(event.date);

          return (
            <div
              key={event._id}
              className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-200"
            >
              {/* Event Image */}
              <div className="relative h-48">
                <SafeImage
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${eventStatus.color}`}
                  >
                    {eventStatus.label}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(event.date), "dd.MM.yyyy", { locale: de })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />€{event.price}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Link href={`/events/${event.slug}`}>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href={`/admin/events/${event._id}/edit`}>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Keine Events gefunden.</p>
          <p className="text-gray-500 text-sm mt-2">
            Versuchen Sie, Ihre Suchkriterien zu ändern oder erstellen Sie ein
            neues Event.
          </p>
        </div>
      )}
    </div>
  );
}
