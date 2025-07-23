"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Target,
  Eye,
  Download,
  Ticket,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { calculateTotalRevenue } from "@/lib/calculateTotalRevenue";

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    charts: {},
    trends: {},
  });
  const [ticketStats, setTicketStats] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [topEventsData, setTopEventsData] = useState([]);

  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true);
      try {
        const [analyticsRes, ticketRes, eventRes, chartsRes] =
          await Promise.all([
            fetch(`/api/admin/analytics?range=${dateRange}`),
            fetch(`/api/admin/tickets/stats?range=${dateRange}`),
            fetch(`/api/admin/events/stats?range=${dateRange}`),
            fetch(`/api/admin/tickets/charts?range=${dateRange}`),
          ]);
        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : {};
        const ticketData = ticketRes.ok ? await ticketRes.json() : {};
        const eventData = eventRes.ok ? await eventRes.json() : {};
        const chartsData = chartsRes.ok ? await chartsRes.json() : {};
        setAnalyticsData(analyticsData);
        setTicketStats(ticketData.stats || null);
        setEventStats(eventData.stats?.overview || null);
        setTopEventsData(chartsData.topEvents || []);
      } catch (err) {
        console.error("Fehler beim Laden der Statistiken:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (typeof value !== "number" || isNaN(value)) return "—";
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const {
    overview = {},
    topEvents = [],
    topCategories = [],
    charts = {},
    trends = {},
  } = analyticsData;

  if (loading || !overview || Object.keys(overview).length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Kompakte Übersicht aus Tickets und Events Stats
  const ticketSummary = [
    { label: "Gesamt Tickets", value: overview?.totalTickets ?? 0 },
    {
      label: "Abgeschlossene Verkäufe",
      value: overview?.completedTickets ?? 0,
    },
    {
      label: "Gesamtumsatz",
      value:
        typeof overview?.totalRevenue === "number"
          ? formatCurrency(overview.totalRevenue)
          : "—",
    },
    {
      label: "Durchschnittlicher Bestellwert",
      value:
        typeof overview?.averageOrderValue === "number"
          ? formatCurrency(overview.averageOrderValue)
          : "—",
    },
    {
      label: "Conversion Rate",
      value:
        typeof overview?.conversionRate === "number"
          ? `${overview.conversionRate}%`
          : "—",
    },
    {
      label: "Rückerstattungsrate",
      value:
        typeof overview?.refundRate === "number"
          ? `${overview.refundRate}%`
          : "—",
    },
  ];

  const eventSummary = [
    { label: "Gesamt Events", value: overview?.totalEvents ?? 0 },
    { label: "Aktive Events", value: overview?.activeEvents ?? 0 },
    { label: "Verkaufte Tickets", value: overview?.totalTicketsSold ?? 0 },
    {
      label: "Gesamtumsatz",
      value:
        typeof overview?.totalRevenue === "number"
          ? formatCurrency(overview.totalRevenue)
          : "—",
    },
    {
      label: "Ø Event-Preis",
      value:
        typeof overview?.averageEventPrice === "number"
          ? formatCurrency(overview.averageEventPrice)
          : "—",
    },
    { label: "Beliebteste Kategorie", value: overview?.popularCategory ?? "—" },
  ];

  return (
    <div className="space-y-6">
      {/* Kompakte Übersicht: Ticket & Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Ticket className="w-5 h-5 mr-2 text-purple-500" />
            Ticket Statistiken
          </h3>
          <ul className="space-y-2">
            {ticketSummary.map((item, idx) => (
              <li key={idx} className="flex justify-between text-gray-300">
                <span className="font-medium text-white">{item.label}</span>
                <span>
                  {typeof item.value === "number"
                    ? formatCurrency(item.value)
                    : item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Event Statistiken
          </h3>
          <ul className="space-y-2">
            {eventSummary.map((item, idx) => (
              <li key={idx} className="flex justify-between text-gray-300">
                <span className="font-medium text-white">{item.label}</span>
                <span>
                  {typeof item.value === "number"
                    ? formatCurrency(item.value)
                    : item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400">
              Detaillierte Einblicke in Ihre Plattform-Performance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
            <option value="90d">Letzte 90 Tage</option>
            <option value="1y">Letztes Jahr</option>
          </select>

          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gesamtumsatz"
          value={
            typeof overview.totalRevenue === "number"
              ? formatCurrency(overview.totalRevenue)
              : "—"
          }
          icon={DollarSign}
          trend={formatPercentage(
            typeof overview.revenueGrowth === "number"
              ? overview.revenueGrowth
              : 0
          )}
          trendPositive={
            typeof overview.revenueGrowth === "number"
              ? overview.revenueGrowth > 0
              : false
          }
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Aktive Events"
          value={
            typeof overview.activeEvents === "number"
              ? overview.activeEvents
              : "—"
          }
          icon={Calendar}
          trend={formatPercentage(
            typeof overview.eventsGrowth === "number"
              ? overview.eventsGrowth
              : 0
          )}
          trendPositive={
            typeof overview.eventsGrowth === "number"
              ? overview.eventsGrowth > 0
              : false
          }
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Registrierte Benutzer"
          value={
            typeof overview.totalUsers === "number" ? overview.totalUsers : "—"
          }
          icon={Users}
          trend={formatPercentage(
            typeof overview.usersGrowth === "number" ? overview.usersGrowth : 0
          )}
          trendPositive={
            typeof overview.usersGrowth === "number"
              ? overview.usersGrowth > 0
              : false
          }
          bgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Ø Ticketpreis"
          value={
            typeof overview.avgTicketPrice === "number"
              ? formatCurrency(overview.avgTicketPrice)
              : "—"
          }
          icon={Target}
          trend={formatPercentage(
            typeof overview.ticketPriceGrowth === "number"
              ? overview.ticketPriceGrowth
              : 0
          )}
          trendPositive={
            typeof overview.ticketPriceGrowth === "number"
              ? overview.ticketPriceGrowth > 0
              : false
          }
          bgColor="bg-yellow-500/10"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Conversion Rate
            </h3>
            <div
              className={`flex items-center ${
                (overview?.conversionGrowth ?? 0) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {(overview?.conversionGrowth ?? 0) > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {formatPercentage(overview?.conversionGrowth ?? 0)}
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {overview?.conversionRate ?? 0}%
          </div>
          <p className="text-gray-400 text-sm">von Besuchern zu Käufern</p>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Beliebteste Kategorie
          </h3>
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {overview?.popularCategory ?? "—"}
          </div>
          <p className="text-gray-400 text-sm">führt in Event-Buchungen</p>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Event</h3>
          <div className="text-2xl font-bold text-pink-400 mb-2">
            {overview?.topEvent ?? "—"}
          </div>
          <p className="text-gray-400 text-sm">meistverkauftes Event</p>
        </div>
      </div>

      {/* Charts entfernt */}

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events (Ticket-Statistikdaten) */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            Top Events
          </h3>
          <div className="space-y-3">
            {topEvents && topEvents.length > 0 ? (
              topEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1e293b] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{event.event}</p>
                      <p className="text-gray-400 text-sm">
                        {event.tickets} Tickets verkauft
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">
                      {formatCurrency(event.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                Keine Event-Daten verfügbar
              </p>
            )}
          </div>
        </div>

        {/* Top Kategorien */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Top Kategorien
          </h3>
          <div className="space-y-3">
            {topCategories && topCategories.length > 0 ? (
              topCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#1e293b] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{cat.name}</p>
                      <p className="text-gray-400 text-sm">
                        {cat.events} Events
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">
                      {formatCurrency(cat.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                Keine Kategorie-Daten verfügbar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights (dynamisch) */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-yellow-500" />
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                Durchschn. Event-Größe
              </span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-white font-semibold">
              {overview?.avgAttendeesPerEvent
                ? overview.avgAttendeesPerEvent.toFixed(1)
                : "—"}{" "}
              Teilnehmer
            </p>
            <p className="text-gray-400 text-xs">Ø Teilnehmer pro Event</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Event-Auslastung</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-white font-semibold">
              {overview?.completionRate
                ? overview.completionRate.toFixed(1)
                : "—"}
              %
            </p>
            <p className="text-gray-400 text-xs">Abgeschlossene Events</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                Beliebteste Kategorie
              </span>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-white font-semibold">
              {overview?.popularCategory ?? "—"}
            </p>
            <p className="text-gray-400 text-xs">
              Kategorie mit meisten Events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
