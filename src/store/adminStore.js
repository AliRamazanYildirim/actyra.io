import { create } from "zustand";

// Einfacher Admin-Store
const useAdminStore = create((set, get) => ({
  // Stats
  stats: {
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
    pendingEvents: 0,
    activeEvents: 0,
    completedEvents: 0,
    failedPayments: 0,
  },

  // Chart data
  chartData: {
    userGrowth: [],
    eventStats: [],
    revenueFlow: [],
  },

  // Loading
  loading: {
    dashboard: true,
  },

  // User role
  userRole: null,
  isAdmin: false,

  // Actions
  setStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),

  setChartData: (chartType, data) =>
    set((state) => ({
      chartData: { ...state.chartData, [chartType]: data },
    })),

  setLoading: (section, isLoading) =>
    set((state) => ({
      loading: { ...state.loading, [section]: isLoading },
    })),

  setUserRole: (role) =>
    set({
      userRole: role,
      isAdmin: role === "admin",
    }),
}));

// Named exports for convenience
export const useAdminStats = () => useAdminStore((state) => state.stats);
export const useAdminLoading = () => useAdminStore((state) => state.loading);
export const useAdminActions = () =>
  useAdminStore((state) => ({
    setStats: state.setStats,
    setLoading: state.setLoading,
    setUserRole: state.setUserRole,
  }));

export default useAdminStore;
