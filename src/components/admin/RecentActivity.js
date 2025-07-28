"use client";

import { memo, useCallback } from "react";
import { Clock, User, Calendar, Ticket, DollarSign } from "lucide-react";
import useAdminStore from "@/store/adminStore";

/**
 * Activity type configurations using ES6+ object destructuring
 */
const activityTypes = {
  user_registered: {
    icon: User,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  event_created: {
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  ticket_purchased: {
    icon: Ticket,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  payment_completed: {
    icon: DollarSign,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
};

/**
 * RecentActivity Component - ES6+ and Next.js 15 optimized
 * Modern component with React.memo, useCallback, and ES6+ patterns
 */

const RecentActivity = memo(() => {
  // Aktivitäten und Ladezustand aus dem AdminStore holen
  const activities = useAdminStore((state) => state.activities);
  const loading = useAdminStore((state) => state.loading.dashboard);

  // Immer echte Aktivitäten anzeigen
  const displayActivities = activities || [];

  // ES6+ Time formatting function with arrow function
  const formatTimeAgo = useCallback((timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Gerade eben";
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `vor ${diffInHours} Std`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `vor ${diffInDays} Tag${diffInDays > 1 ? "en" : ""}`;
  }, []);

  // ES6+ Activity renderer with arrow function and destructuring
  const renderActivity = useCallback(
    (activity) => {
      const activityConfig =
        activityTypes[activity.type] || activityTypes.user_registered;
      const { icon: Icon, bg, color } = activityConfig;

      return (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="flex-1 min-w-0 bg-[#edede959] rounded-lg">
            <p className="text-sm text-black font-medium">
              {activity.description}
            </p>
            <p className="text-xs text-black mt-1">
              {formatTimeAgo(activity.timestamp)}
            </p>
          </div>
        </div>
      );
    },
    [formatTimeAgo]
  );

  // ES6+ Loading state with early return
  if (loading) {
    return (
      <div className="bg-white backdrop-blur-xl border border-transparent rounded-2xl p-7 relative transition-all duration-300 shadow-[0_2px_24px_0_rgba(168,85,247,0.12)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:transition-all before:duration-300 before:shadow-[0_0_32px_8px_rgba(168,85,247,0.18)] hover:before:shadow-[0_0_48px_12px_rgba(168,85,247,0.32)] hover:shadow-[0_4px_32px_0_rgba(168,85,247,0.22)]">
        <h3 className="text-lg font-semibold text-white mb-4">
          Aktuelle Aktivitäten
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white backdrop-blur-xl border border-transparent rounded-2xl p-7 relative transition-all duration-300 shadow-[0_2px_24px_0_rgba(168,85,247,0.12)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:transition-all before:duration-300 before:shadow-[0_0_32px_8px_rgba(168,85,247,0.18)] hover:before:shadow-[0_0_48px_12px_rgba(168,85,247,0.32)] hover:shadow-[0_4px_32px_0_rgba(168,85,247,0.22)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">
          Aktuelle Aktivitäten
        </h3>
        <Clock className="w-5 h-5 text-gray-900" />
      </div>

      <div className="space-y-4">
        {displayActivities.map(renderActivity)}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Alle Aktivitäten anzeigen →
        </button>
      </div>
    </div>
  );
});

// ES6+ Display name for debugging
RecentActivity.displayName = "RecentActivity";

export default RecentActivity;
