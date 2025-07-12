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
  Filter,
  DateRange
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import ChartCard from "@/components/admin/ChartCard";

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    charts: {},
    trends: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Analytics-Daten:', error);
      // Mock-Daten für Demo
      setAnalyticsData({
        overview: {
          totalRevenue: 45672.50,
          revenueGrowth: 18.5,
          totalEvents: 124,
          eventsGrowth: 12.3,
          totalUsers: 2847,
          usersGrowth: 24.7,
          avgTicketPrice: 67.85,
          ticketPriceGrowth: -2.1,
          conversionRate: 3.2,
          conversionGrowth: 8.4,
          popularCategory: "Technologie & Innovation",
          topEvent: "Tech Conference 2025",
          activeEvents: 42
        },
        charts: {
          revenueOverTime: [
            { label: "Jan", value: 3200 },
            { label: "Feb", value: 4100 },
            { label: "Mar", value: 3800 },
            { label: "Apr", value: 5200 },
            { label: "Mai", value: 6100 },
            { label: "Jun", value: 7300 },
            { label: "Jul", value: 8900 },
            { label: "Aug", value: 7600 }
          ],
          userRegistrations: [
            { label: "Jan", value: 145 },
            { label: "Feb", value: 189 },
            { label: "Mar", value: 234 },
            { label: "Apr", value: 267 },
            { label: "Mai", value: 298 },
            { label: "Jun", value: 342 },
            { label: "Jul", value: 398 },
            { label: "Aug", value: 445 }
          ],
          eventsByCategory: [
            { label: "Technologie & Innovation", value: 28 },
            { label: "Business & Networking", value: 22 },
            { label: "Kultur & Musik", value: 18 },
            { label: "Sport & Freizeit", value: 15 },
            { label: "Bildung & Workshop", value: 12 },
            { label: "Gesundheit & Wellness", value: 8 }
          ],
          ticketSales: [
            { label: "Woche 1", value: 234 },
            { label: "Woche 2", value: 345 },
            { label: "Woche 3", value: 423 },
            { label: "Woche 4", value: 567 },
            { label: "Woche 5", value: 689 },
            { label: "Woche 6", value: 745 },
            { label: "Woche 7", value: 823 },
            { label: "Woche 8", value: 891 }
          ]
        },
        trends: {
          topEvents: [
            { name: "Tech Conference 2025", tickets: 234, revenue: 20796.60 },
            { name: "Business Networking Night", tickets: 87, revenue: 6525.00 },
            { name: "Kunstworkshop", tickets: 18, revenue: 810.00 },
            { name: "Yoga Retreat", tickets: 45, revenue: 2700.00 },
            { name: "Startup Pitch Event", tickets: 156, revenue: 9360.00 }
          ],
          topCategories: [
            { name: "Technologie & Innovation", events: 28, revenue: 25840.50 },
            { name: "Business & Networking", events: 22, revenue: 18650.75 },
            { name: "Kultur & Musik", events: 18, revenue: 12450.00 },
            { name: "Sport & Freizeit", events: 15, revenue: 8970.25 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(8)].map((_, i) => (
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

  const { overview, charts, trends } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400">Detaillierte Einblicke in Ihre Plattform-Performance</p>
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
          value={formatCurrency(overview.totalRevenue)}
          icon={DollarSign}
          trend={formatPercentage(overview.revenueGrowth)}
          trendPositive={overview.revenueGrowth > 0}
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Aktive Events"
          value={overview.totalEvents}
          icon={Calendar}
          trend={formatPercentage(overview.eventsGrowth)}
          trendPositive={overview.eventsGrowth > 0}
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Registrierte Benutzer"
          value={overview.totalUsers}
          icon={Users}
          trend={formatPercentage(overview.usersGrowth)}
          trendPositive={overview.usersGrowth > 0}
          bgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Ø Ticketpreis"
          value={formatCurrency(overview.avgTicketPrice)}
          icon={Target}
          trend={formatPercentage(overview.ticketPriceGrowth)}
          trendPositive={overview.ticketPriceGrowth > 0}
          bgColor="bg-yellow-500/10"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Conversion Rate</h3>
            <div className={`flex items-center ${overview.conversionGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {overview.conversionGrowth > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{formatPercentage(overview.conversionGrowth)}</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{overview.conversionRate}%</div>
          <p className="text-gray-400 text-sm">von Besuchern zu Käufern</p>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Beliebteste Kategorie</h3>
          <div className="text-2xl font-bold text-purple-400 mb-2">{overview.popularCategory}</div>
          <p className="text-gray-400 text-sm">führt in Event-Buchungen</p>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Event</h3>
          <div className="text-2xl font-bold text-pink-400 mb-2">{overview.topEvent}</div>
          <p className="text-gray-400 text-sm">meistverkauftes Event</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Umsatz-Entwicklung"
          data={charts.revenueOverTime}
          type="line"
        />
        <ChartCard
          title="Benutzer-Registrierungen"
          data={charts.userRegistrations}
          type="line"
        />
        <ChartCard
          title="Events nach Kategorien"
          data={charts.eventsByCategory}
          type="doughnut"
        />
        <ChartCard
          title="Ticket-Verkäufe"
          data={charts.ticketSales}
          type="line"
        />
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            Top Events
          </h3>
          <div className="space-y-3">
            {trends.topEvents?.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1e293b] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{event.name}</p>
                    <p className="text-gray-400 text-sm">{event.tickets} Tickets verkauft</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{formatCurrency(event.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Top Kategorien
          </h3>
          <div className="space-y-3">
            {trends.topCategories?.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1e293b] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-gray-400 text-sm">{category.events} Events</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">{formatCurrency(category.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-yellow-500" />
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Beste Verkaufszeit</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-white font-semibold">18:00 - 20:00 Uhr</p>
            <p className="text-gray-400 text-xs">+35% höhere Conversion</p>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Durchschn. Event-Größe</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-white font-semibold">127 Teilnehmer</p>
            <p className="text-gray-400 text-xs">+12% vs. letzter Monat</p>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Event-Auslastung</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-white font-semibold">78.5%</p>
            <p className="text-gray-400 text-xs">Optimaler Bereich</p>
          </div>
        </div>
      </div>
    </div>
  );
}
