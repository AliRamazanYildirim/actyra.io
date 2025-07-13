"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Ticket,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCcw,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "purple",
}) => {
  const colorClasses = {
    purple: "from-purple-600 to-pink-500",
    green: "from-green-600 to-emerald-500",
    blue: "from-blue-600 to-cyan-500",
    yellow: "from-yellow-600 to-orange-500",
    red: "from-red-600 to-rose-500",
    indigo: "from-indigo-600 to-purple-500",
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`bg-gradient-to-r ${colorClasses[color]} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminTicketStatsPage() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    completedTickets: 0,
    pendingTickets: 0,
    failedTickets: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    refundRate: 0,
    // Trenddaten für
    previousStats: {
      totalTickets: 0,
      completedTickets: 0,
      pendingTickets: 0,
      failedTickets: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      refundRate: 0,
    },
  });

  const [chartData, setChartData] = useState({
    dailySales: [],
    monthlyRevenue: [],
    statusDistribution: [],
    paymentMethods: [],
    topEvents: [],
    hourlyDistribution: [],
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  const fetchTicketStats = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch main stats
      const statsResponse = await fetch(
        `/api/admin/tickets/stats?range=${timeRange}`
      );
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch chart data
      const chartsResponse = await fetch(
        `/api/admin/tickets/charts?range=${timeRange}`
      );
      if (chartsResponse.ok) {
        const chartsData = await chartsResponse.json();
        setChartData(chartsData);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Ticket-Statistiken:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchTicketStats();
  }, [fetchTicketStats]);

  const calculateStats = () => {
    // Verwende echte Datenbankdaten, fallback auf 0
    return {
      totalTickets: stats.totalTickets || 0,
      completedTickets: stats.completedTickets || 0,
      pendingTickets: stats.pendingTickets || 0,
      failedTickets: stats.failedTickets || 0,
      totalRevenue: stats.totalRevenue || 0,
      averageOrderValue: stats.averageOrderValue || 0,
      conversionRate: stats.conversionRate || 0,
      refundRate: stats.refundRate || 0,
    };
  };

  const calculatedStats = calculateStats();

  // Verwende echte Datenbankdaten
  const dailySalesData = chartData.dailySales || [];
  const statusDistributionData = chartData.statusDistribution || [];
  const paymentMethodsData = chartData.paymentMethods || [];
  const topEventsData = chartData.topEvents || [];
  const hourlyDistributionData = chartData.hourlyDistribution || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wenn keine Daten vorhanden sind, zeige eine private Nachricht.
  const hasAnyData =
    calculatedStats.totalTickets > 0 ||
    dailySalesData.length > 0 ||
    statusDistributionData.length > 0 ||
    paymentMethodsData.length > 0 ||
    topEventsData.length > 0;

  if (!hasAnyData && !loading) {
    return (
      <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Ticket Statistiken
              </h1>
              <p className="text-gray-400 mt-1">
                Umfassende Analyse Ihrer Ticket-Verkäufe
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="cursor-pointer px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-[#334155]"
              >
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
                <option value="90d">Letzte 90 Tage</option>
                <option value="1y">Letztes Jahr</option>
              </select>

              <button
                onClick={fetchTicketStats}
                className="cursor-pointer px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white hover:bg-[#334155] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Aktualisieren
              </button>
            </div>
          </div>

          {/* Keine Daten Nachricht */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Ticket className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Keine Ticket-Daten verfügbar
              </h2>
              <p className="text-gray-400 mb-6">
                Es wurden noch keine Tickets verkauft oder es liegen keine Daten
                für den gewählten Zeitraum vor. Sobald Tickets verkauft werden,
                erscheinen hier detaillierte Statistiken und Analysen.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  💡 Versuchen Sie einen anderen Zeitraum zu wählen
                </p>
                <p className="text-sm text-gray-500">
                  📊 Statistiken werden automatisch aktualisiert bei neuen
                  Verkäufen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Ticket Statistiken
            </h1>
            <p className="text-gray-400 mt-1">
              Umfassende Analyse Ihrer Ticket-Verkäufe
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="cursor-pointer px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-[#334155]"
            >
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
              <option value="90d">Letzte 90 Tage</option>
              <option value="1y">Letztes Jahr</option>
            </select>

            <button
              onClick={fetchTicketStats}
              className="cursor-pointer px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white hover:bg-[#334155] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Aktualisieren
            </button>

            <button className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Gesamt Tickets"
            value={calculatedStats.totalTickets.toLocaleString("de-DE")}
            icon={Ticket}
            trend={null}
            trendValue={null}
            color="purple"
          />
          <StatCard
            title="Abgeschlossene Verkäufe"
            value={calculatedStats.completedTickets.toLocaleString("de-DE")}
            icon={CheckCircle}
            trend={null}
            trendValue={null}
            color="green"
          />
          <StatCard
            title="Gesamtumsatz"
            value={`€${calculatedStats.totalRevenue.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })}`}
            icon={DollarSign}
            trend={null}
            trendValue={null}
            color="blue"
          />
          <StatCard
            title="Durchschnittlicher Bestellwert"
            value={`€${calculatedStats.averageOrderValue.toFixed(2)}`}
            icon={CreditCard}
            trend={null}
            trendValue={null}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ausstehende Tickets"
            value={calculatedStats.pendingTickets.toLocaleString("de-DE")}
            icon={Clock}
            trend={null}
            trendValue={null}
            color="yellow"
          />
          <StatCard
            title="Fehlgeschlagene Zahlungen"
            value={calculatedStats.failedTickets.toLocaleString("de-DE")}
            icon={XCircle}
            trend={null}
            trendValue={null}
            color="red"
          />
          <StatCard
            title="Conversion Rate"
            value={`${calculatedStats.conversionRate}%`}
            icon={TrendingUp}
            trend={null}
            trendValue={null}
            color="green"
          />
          <StatCard
            title="Rückerstattungsrate"
            value={`${calculatedStats.refundRate}%`}
            icon={TrendingDown}
            trend={null}
            trendValue={null}
            color="blue"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Daily Ticket Sales */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                Tägliche Ticket-Verkäufe
              </h3>
              <button className="cursor-pointer p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-all duration-200">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {dailySalesData.length > 0 ? (
                <AreaChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#8b5cf6"
                    fill="url(#ticketGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="ticketGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Keine Verkaufsdaten verfügbar
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Daten werden geladen oder sind für den gewählten Zeitraum
                      nicht vorhanden
                    </p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-green-500" />
                Status Verteilung
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {statusDistributionData.length > 0 &&
              calculatedStats.totalTickets > 0 ? (
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: ${Math.round(
                        (value / calculatedStats.totalTickets) * 100
                      )}%`
                    }
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <PieChartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Keine Status-Daten verfügbar
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Noch keine Tickets für den gewählten Zeitraum vorhanden
                    </p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                Umsatz Trend
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {dailySalesData.length > 0 ? (
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Keine Umsatzdaten verfügbar</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Umsatztrend wird angezeigt sobald Verkäufe getätigt werden
                    </p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-yellow-500" />
                Zahlungsmethoden
              </h3>
            </div>
            <div className="space-y-4">
              {paymentMethodsData.length > 0 ? (
                paymentMethodsData.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
                      <span className="text-gray-300">{method.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">
                        {method.count}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({method.percentage}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      Keine Zahlungsdaten verfügbar
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Zahlungsmethoden werden angezeigt sobald Käufe getätigt
                      werden
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Events Table */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Top Events nach Ticket-Verkäufen
            </h3>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            {topEventsData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Event
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Tickets verkauft
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Umsatz
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Anteil
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topEventsData.map((event, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-[#1e293b]/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">
                          {event.event}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{event.tickets}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">
                          €{event.revenue.toLocaleString("de-DE")}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  topEventsData[0]?.tickets > 0
                                    ? (event.tickets /
                                        topEventsData[0].tickets) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {topEventsData[0]?.tickets > 0
                              ? Math.round(
                                  (event.tickets / topEventsData[0].tickets) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Keine Event-Daten verfügbar
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Top Events werden angezeigt sobald Tickets verkauft werden
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {topEventsData.length > 0 ? (
              topEventsData.map((event, index) => (
                <div
                  key={index}
                  className="bg-[#1e293b] border border-gray-700 rounded-lg p-4 hover:bg-[#334155]/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium text-sm">
                      {event.event}
                    </h4>
                    <span className="text-gray-400 text-xs">#{index + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Tickets:</span>
                      <span className="text-white ml-2">{event.tickets}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Umsatz:</span>
                      <span className="text-white ml-2">
                        €{event.revenue.toLocaleString("de-DE")}
                      </span>
                    </div>
                  </div>{" "}
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${
                            topEventsData[0]?.tickets > 0
                              ? (event.tickets / topEventsData[0].tickets) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Keine Event-Daten verfügbar</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Top Events werden angezeigt sobald Tickets verkauft werden
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
