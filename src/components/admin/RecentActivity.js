"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Clock, User, Calendar, Ticket, DollarSign } from "lucide-react";

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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ES6+ Mock data with useMemo for performance
  const mockActivities = useMemo(
    () => [
      {
        id: 1,
        type: "user_registered",
        description: "Neuer Benutzer Max Mustermann registriert",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 2,
        type: "event_created",
        description: 'Event "Kunstworkshop 2025" wurde erstellt',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 3,
        type: "ticket_purchased",
        description: '3 Tickets für "Tech Conference" verkauft',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 4,
        type: "payment_completed",
        description: "Zahlung über €89.50 abgeschlossen",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 5,
        type: "user_registered",
        description: "Neuer Benutzer Anna Schmidt registriert",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
    []
  );

  // ES6+ Async function with useCallback
  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/recent-activity");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        console.warn("API response not ok:", response.status);
        // Fallback to mock data on API error
        setActivities(mockActivities);
      }
    } catch (error) {
      console.error("Fehler beim Laden der aktuellen Aktivitäten:", error);
      // Fallback to mock data on network error
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  }, [mockActivities]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

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
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">
              {activity.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
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
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
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
    <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Aktuelle Aktivitäten
        </h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">{activities.map(renderActivity)}</div>

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
