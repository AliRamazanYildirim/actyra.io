"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  Download,
} from "lucide-react";
import {
  format,
  subDays,
  eachDayOfInterval,
} from "date-fns";
import { de } from "date-fns/locale";
import { calculateTotalRevenue } from "@/lib/calculateTotalRevenue";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff88",
  "#ff0088",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#87ceeb",
];

export default function EventStatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {
      totalEvents: 0,
      activeEvents: 0,
      totalTicketsSold: 0,
      totalRevenue: 0,
      averageEventPrice: 0,
      completionRate: 0,
      popularCategory: "",
      avgAttendeesPerEvent: 0,
    },
    chartData: {
      eventsOverTime: [],
      categoryDistribution: [],
      revenueOverTime: [],
      ticketSalesOverTime: [],
      eventsByStatus: [],
      priceRanges: [],
      monthlyPerformance: [],
    },
    trends: {
      eventsGrowth: 0,
      revenueGrowth: 0,
      ticketsGrowth: 0,
      activeEventsGrowth: 0,
    },
  });

  useEffect(() => {
    fetchEventStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEventStats = async () => {
    try {
      setLoading(true);

     // Ereignis- und Ticketdaten parallel abrufen
      const [eventsResponse, ticketsResponse] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/tickets"),
      ]);

      if (eventsResponse.ok && ticketsResponse.ok) {
        const eventsData = await eventsResponse.json();
        const ticketsData = await ticketsResponse.json();

        const events = eventsData.events || [];
        const tickets = ticketsData.tickets || [];

        const calculatedStats = calculateStats(events, tickets);
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error("Error while loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (events, tickets) => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Grundlegende Übersicht Statistiken
    const totalEvents = events.length;
    const activeEvents = events.filter((e) => e.status === "active").length;
    const completedEvents = events.filter((e) => e.status === "completed").length;
    const totalTicketsSold = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);
    const totalRevenue = calculateTotalRevenue(tickets);
    const averageEventPrice =
      events.length > 0
        ? events.reduce((sum, e) => sum + e.price, 0) / events.length
        : 0;
    const completionRate =
      totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    // Kategorieverteilung
    const categoryCount = {};
    events.forEach((event) => {
      categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
    });

    const popularCategory = Object.keys(categoryCount).reduce(
      (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
      "Yok"
    );

    const avgAttendeesPerEvent =
      totalEvents > 0 ? totalTicketsSold / totalEvents : 0;

    // Tägliche Gruppierung für Zeitreihendaten
    const last30Days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

    const eventsOverTime = last30Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.createdAt || event.date);
        return format(eventDate, "yyyy-MM-dd") === dayStr;
      }).length;

      return {
        date: format(day, "dd.MM", { locale: de }),
        events: dayEvents,
        fullDate: dayStr,
      };
    });

    // Kategorienverteilung Diagrammdaten
    const categoryDistribution = Object.entries(categoryCount).map(
      ([category, count]) => ({
        name: formatCategoryName(category),
        value: count,
        percentage: ((count / totalEvents) * 100).toFixed(1),
      })
    );

    // Einnahmen-Zeitreihe
    const revenueOverTime = last30Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayRevenue = tickets
        .filter((ticket) => {
          const ticketDate = new Date(ticket.createdAt || ticket.date);
          return format(ticketDate, "yyyy-MM-dd") === dayStr;
        })
        .reduce(
          (sum, ticket) => sum + ticket.price * (ticket.quantity || 1),
          0
        );

      return {
        date: format(day, "dd.MM", { locale: de }),
        revenue: dayRevenue,
        fullDate: dayStr,
      };
    });

    // Ticket-Verkaufstrend
    const ticketSalesOverTime = last30Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayTickets = tickets
        .filter((ticket) => {
          const ticketDate = new Date(ticket.createdAt || ticket.date);
          return format(ticketDate, "yyyy-MM-dd") === dayStr;
        })
        .reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

      return {
        date: format(day, "dd.MM", { locale: de }),
        tickets: dayTickets,
        fullDate: dayStr,
      };
    });

    // Statusverteilung
    const statusCount = {};
    events.forEach((event) => {
      statusCount[event.status] = (statusCount[event.status] || 0) + 1;
    });

    const eventsByStatus = Object.entries(statusCount).map(
      ([status, count]) => ({
        name: formatStatusName(status),
        value: count,
        percentage: ((count / totalEvents) * 100).toFixed(1),
      })
    );

    // Analyse der Preisspannen
    const priceRanges = [
      { range: "0-25€", min: 0, max: 25 },
      { range: "26-50€", min: 26, max: 50 },
      { range: "51-100€", min: 51, max: 100 },
      { range: "101-200€", min: 101, max: 200 },
      { range: "200€+", min: 201, max: Infinity },
    ].map((range) => ({
      name: range.range,
      value: events.filter((e) => e.price >= range.min && e.price <= range.max)
        .length,
    }));

    // Berechnung von Wachstumstrends
    const recentEvents = events.filter(
      (e) => new Date(e.createdAt || e.date) >= thirtyDaysAgo
    ).length;
    const oldEvents = events.filter((e) => {
      const date = new Date(e.createdAt || e.date);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    }).length;

    const recentRevenue = tickets
      .filter((t) => new Date(t.createdAt || t.date) >= thirtyDaysAgo)
      .reduce((sum, ticket) => sum + ticket.price * (ticket.quantity || 1), 0);
    const oldRevenue = tickets
      .filter((t) => {
        const date = new Date(t.createdAt || t.date);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, ticket) => sum + ticket.price * (ticket.quantity || 1), 0);

    const recentTickets = tickets
      .filter((t) => new Date(t.createdAt || t.date) >= thirtyDaysAgo)
      .reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);
    const oldTickets = tickets
      .filter((t) => {
        const date = new Date(t.createdAt || t.date);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

    const eventsGrowth =
      oldEvents > 0 ? ((recentEvents - oldEvents) / oldEvents) * 100 : 0;
    const revenueGrowth =
      oldRevenue > 0 ? ((recentRevenue - oldRevenue) / oldRevenue) * 100 : 0;
    const ticketsGrowth =
      oldTickets > 0 ? ((recentTickets - oldTickets) / oldTickets) * 100 : 0;

    return {
      overview: {
        totalEvents,
        activeEvents,
        completedEvents, // Hinzugefügt
        totalTicketsSold,
        totalRevenue,
        averageEventPrice,
        completionRate,
        popularCategory: formatCategoryName(popularCategory),
        avgAttendeesPerEvent,
      },
      chartData: {
        eventsOverTime,
        categoryDistribution,
        revenueOverTime,
        ticketSalesOverTime,
        eventsByStatus,
        priceRanges,
        monthlyPerformance: [],
      },
      trends: {
        eventsGrowth,
        revenueGrowth,
        ticketsGrowth,
        activeEventsGrowth: 0,
      },
    };
  };

  const formatCategoryName = (category) => {
    const categoryNames = {
      "kultur-musik": "Kultur & Musik",
      "sport-freizeit": "Sport & Freizeit",
      "bildung-workshop": "Bildung & Workshop",
      "business-networking": "Business & Networking",
      gesundheit: "Gesundheit",
      "technologie-innovation": "Technologie & Innovation",
      "messen-ausstellungen": "Messen & Ausstellungen",
      "sonstige-events": "Sonstige Events",
    };
    return categoryNames[category] || category;
  };

  const formatStatusName = (status) => {
    const statusNames = {
      pending: "Ausstehend",
      active: "Aktiv",
      completed: "Abgeschlossen",
      cancelled: "Abgesagt",
    };
    return statusNames[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("de-DE").format(number);
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue",
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mb-1`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend !== undefined && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${trend < 0 ? "rotate-180" : ""}`}
              />
              <span>
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}% vs. letzter Monat
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Lade Event-Statistiken...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between shadow-lg shadow-blue-700/20 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 rounded-xl p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-50 mb-2">
              Event-Statistiken
            </h1>
            <p className="text-gray-100">
              Umfassende Analyse Ihrer Veranstaltungen und Performance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={fetchEventStats}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              Aktualisieren
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Gesamt Events"
            value={formatNumber(stats.overview.totalEvents)}
            subtitle="Alle Veranstaltungen"
            icon={Calendar}
            trend={stats.trends.eventsGrowth}
            color="blue"
          />
          <StatCard
            title="Aktive Events"
            value={formatNumber(stats.overview.activeEvents)}
            subtitle="Derzeit buchbar"
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Verkaufte Tickets"
            value={formatNumber(stats.overview.totalTicketsSold)}
            subtitle="Gesamtverkäufe"
            icon={Users}
            trend={stats.trends.ticketsGrowth}
            color="purple"
          />
          <StatCard
            title="Gesamtumsatz"
            value={formatCurrency(stats.overview.totalRevenue)}
            subtitle="Bruttoumsatz"
            icon={DollarSign}
            trend={stats.trends.revenueGrowth}
            color="emerald"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ø Event-Preis"
            value={formatCurrency(stats.overview.averageEventPrice)}
            subtitle="Durchschnittspreis"
            icon={Target}
            color="orange"
          />
          <StatCard
            title="Abgeschlossene Events"
            value={formatNumber(stats.overview.completedEvents)}
            subtitle="Beendete Veranstaltungen"
            icon={BarChart3}
            color="green"
          />
          <StatCard
            title="Ø Teilnehmer"
            value={stats.overview.avgAttendeesPerEvent.toFixed(1)}
            subtitle="Pro Event"
            icon={Users}
            color="pink"
          />
          <StatCard
            title="Top Kategorie"
            value={stats.overview.popularCategory}
            subtitle="Beliebteste Kategorie"
            icon={Star}
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Events über Zeit
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.chartData.eventsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Umsatz über Zeit
              </h3>
              <DollarSign className="w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [formatCurrency(value), "Umsatz"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Kategorie-Verteilung
              </h3>
              <PieChart className="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  dataKey="value"
                  data={stats.chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {stats.chartData.categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Event-Status
              </h3>
              <Activity className="w-5 h-5 text-gray-500 group-hover:text-indigo-500 transition-colors" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.chartData.eventsByStatus}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#6b7280"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Ranges Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              Preis-Verteilung
            </h3>
            <DollarSign className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.chartData.priceRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              Ticket-Verkäufe Trend
            </h3>
            <Users className="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.chartData.ticketSalesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [value, "Tickets"]}
              />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Performance Highlights
              </h4>
              <p className="text-blue-100">
                {stats.overview.totalEvents} Events generiert,{" "}
                {formatCurrency(stats.overview.totalRevenue)} Gesamtumsatz
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Wachstum</h4>
              <p className="text-blue-100">
                {stats.trends.eventsGrowth > 0 ? "+" : ""}
                {stats.trends.eventsGrowth.toFixed(1)}% Events,
                {stats.trends.revenueGrowth > 0 ? " +" : " "}
                {stats.trends.revenueGrowth.toFixed(1)}% Umsatz
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Nächste Schritte</h4>
              <p className="text-blue-100">
                Fokus auf {stats.overview.popularCategory} Events für maximale
                Performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
