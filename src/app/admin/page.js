"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import ChartCard from "@/components/admin/ChartCard";
import RecentActivity from "@/components/admin/RecentActivity";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
    pendingEvents: 0,
    activeEvents: 0,
    completedEvents: 0,
    failedPayments: 0,
  });

  const [chartData, setChartData] = useState({
    weeklyRevenue: [],
    eventsByCategory: [],
    userGrowth: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setChartData(data.charts);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Zuletzt aktualisiert: {new Date().toLocaleString('de-DE')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gesamte Benutzer"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
          trendPositive={true}
        />
        <StatsCard
          title="Aktive Events"
          value={stats.activeEvents}
          icon={Calendar}
          trend="+5%"
          trendPositive={true}
        />
        <StatsCard
          title="Verkaufte Tickets"
          value={stats.totalTickets}
          icon={Ticket}
          trend="+23%"
          trendPositive={true}
        />
        <StatsCard
          title="Gesamtumsatz"
          value={`€${stats.totalRevenue.toLocaleString('de-DE')}`}
          icon={DollarSign}
          trend="+18%"
          trendPositive={true}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Wartende Events"
          value={stats.pendingEvents}
          icon={Clock}
          bgColor="bg-yellow-500/10"
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Abgeschlossene Events"
          value={stats.completedEvents}
          icon={CheckCircle}
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Fehlgeschlagene Zahlungen"
          value={stats.failedPayments}
          icon={XCircle}
          bgColor="bg-red-500/10"
          iconColor="text-red-500"
        />
        <StatsCard
          title="Wachstumsrate"
          value="24%"
          icon={TrendingUp}
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Wöchentlicher Umsatz"
          data={chartData.weeklyRevenue}
          type="line"
        />
        <ChartCard
          title="Events nach Kategorien"
          data={chartData.eventsByCategory}
          type="doughnut"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Schnellaktionen</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 text-sm lg:text-base">
              Neues Event erstellen
            </button>
            <button className="w-full bg-[#1e293b] text-white py-2 px-4 rounded-lg hover:bg-[#334155] transition-all duration-200 text-sm lg:text-base">
              Benutzer verwalten
            </button>
            <button className="w-full bg-[#1e293b] text-white py-2 px-4 rounded-lg hover:bg-[#334155] transition-all duration-200 text-sm lg:text-base">
              Berichte generieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
