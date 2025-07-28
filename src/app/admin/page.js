"use client";

import { useEffect } from "react";
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
import useAdminStore from "@/store/adminStore";

/**
 * Admin Dashboard Page
 * Modern dashboard with Zustand state management
 * ES6+ and Next.js 15 optimized
 */
export default function AdminDashboard() {
  // Zustand store
  const stats = useAdminStore((state) => state.stats);
  const chartData = useAdminStore((state) => state.chartData);
  const loading = useAdminStore((state) => state.loading);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const setStats = useAdminStore((state) => state.setStats);
  const setChartData = useAdminStore((state) => state.setChartData);
  const setLoading = useAdminStore((state) => state.setLoading);
  const setActivities = useAdminStore((state) => state.setActivities);

  useEffect(() => {
    // Debug: Admin-Status protokollieren
    console.log("🔍 Admin check:", { isAdmin });

    // Nur wenn Admin, Daten abrufen
    if (!isAdmin) {
      console.log("❌Kein Admin, Daten werden nicht abgerufen.");
      return;
    }

    console.log("✅ Admin bestätigt, Daten werden abgerufen...");

    const fetchDashboardData = async () => {
      try {
        setLoading("dashboard", true);

        console.log("📡API-Anfragen werden gestartet...");

        // Echte Daten von APIs abrufen - ES6+ Promise.all
        const [statsResponse, chartsResponse, activityResponse] =
          await Promise.all([
            fetch("/api/admin/stats"),
            fetch("/api/admin/charts"),
            fetch("/api/admin/recent-activity"),
          ]);

        console.log("📊 API-Antworten:", {
          stats: statsResponse.status,
          charts: chartsResponse.status,
          activities: activityResponse.status,
        });

        if (statsResponse.ok && chartsResponse.ok && activityResponse.ok) {
          const statsData = await statsResponse.json();
          const chartData = await chartsResponse.json();
          const activityData = await activityResponse.json();

          console.log("✅ Real data loaded:", {
            statsData,
            chartData,
            activityData,
          });

          // Im Zustand-Store speichern
          setStats(statsData);
          setChartData("userGrowth", chartData.userGrowth);
          setChartData("eventStats", chartData.eventStats);
          setChartData("revenueFlow", chartData.revenueFlow);
          setActivities(activityData.activities || []);
        } else {
          console.error("❌ API-Fehler:", {
            stats: statsResponse.status,
            charts: chartsResponse.status,
            activities: activityResponse.status,
          });
          // Fallback-Daten bei einem API-Fehler verwenden
          console.log("🔄 Esatzdaten werden verwendet...");
        }
      } catch (error) {
        console.error("❌ Dashboard-Datenladefehler:", error);
      } finally {
        setLoading("dashboard", false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, setStats, setChartData, setLoading, setActivities]);

  // Administrator-Berechtigungsprüfung
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0D0E25] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Zugriff verweigert
          </h1>
          <p className="text-gray-400">Sie haben keine Admin-Berechtigung.</p>
        </div>
      </div>
    );
  }

  if (loading.dashboard) {
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
      <div className="flex items-center justify-between shadow-lg shadow-blue-700/20 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 rounded-xl p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-100">
          Zuletzt aktualisiert: {new Date().toLocaleString("de-DE")}
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
          isLoading={loading.dashboard}
          bgColor="bg-yellow-500/10"
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Aktive Events"
          value={stats.activeEvents}
          icon={Calendar}
          trend="+5%"
          trendPositive={true}
          isLoading={loading.dashboard}
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Verkaufte Tickets"
          value={stats.totalTicketsSold ?? stats.totalTickets}
          icon={Ticket}
          trend="+23%"
          trendPositive={true}
          isLoading={loading.dashboard}
          bgColor="bg-red-500/10"
          iconColor="text-red-500"
        />
        <StatsCard
          title="Gesamtumsatz"
          value={`€${stats.totalRevenue.toLocaleString("de-DE")}`}
          icon={DollarSign}
          trend="+18%"
          trendPositive={true}
          isLoading={loading.dashboard}
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
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
          isLoading={loading.dashboard}
        />
        <StatsCard
          title="Abgeschlossene Events"
          value={stats.completedEvents}
          icon={CheckCircle}
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
          isLoading={loading.dashboard}
        />
        <StatsCard
          title="Fehlgeschlagene Zahlungen"
          value={stats.failedPayments}
          icon={XCircle}
          bgColor="bg-red-500/10"
          iconColor="text-red-500"
          isLoading={loading.dashboard}
        />
        <StatsCard
          title="Wachstumsrate"
          value="24%"
          icon={TrendingUp}
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
          isLoading={loading.dashboard}
        />
      </div>

      {/* Charts - ES6+ modern ChartCard components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ChartCard
          title="Benutzerwachstum"
          data={chartData.userGrowth}
          type="line"
        />
        <ChartCard
          title="Events nach Kategorien"
          data={chartData.eventStats}
          type="doughnut"
        />
        <ChartCard
          title="Umsatzentwicklung"
          data={chartData.revenueFlow}
          type="bar"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">       
          <RecentActivity />
        </div>
         <div
          className={`bg-[#1e293b]backdrop-blur-xl border border-transparent rounded-2xl p-7 relative transition-all duration-300 shadow-[0_2px_24px_0_rgba(168,85,247,0.12)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:transition-all before:duration-300 before:shadow-[0_0_32px_8px_rgba(168,85,247,0.18)] hover:before:shadow-[0_0_48px_12px_rgba(168,85,247,0.32)] hover:shadow-[0_4px_32px_0_rgba(168,85,247,0.22)]`}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Schnellaktionen
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 text-sm lg:text-base cursor-pointer">
              Neues Event erstellen
            </button>
            <button className="w-full bg-[#1e293b] text-white py-2 px-4 rounded-lg hover:bg-[#334155] transition-all duration-200 text-sm lg:text-base cursor-pointer">
              Benutzer verwalten
            </button>
            <button className="w-full bg-[#1e293b] text-white py-2 px-4 rounded-lg hover:bg-[#334155] transition-all duration-200 text-sm lg:text-base cursor-pointer">
              Berichte generieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
