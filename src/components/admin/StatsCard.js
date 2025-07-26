"use client";

import React, { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatsCard Component - Displays statistical information with trend indicators
 * Optimized for Next.js 15 with ES6+ standards and Zustand integration
 */
const StatsCard = memo(
  ({
    title,
    value,
    icon: Icon,
    trend,
    trendPositive = true,
    bgColor = "bg-white",
    iconColor = "text-black",
    className = "",
    isLoading = false,
  }) => {
    // Loading state
    if (isLoading) {
      return (
        <div
          className={`bg-white border border-gray-200 rounded-lg p-6 animate-pulse ${className}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-black mb-1">{title}</p>
            <p className="text-2xl font-bold text-black">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {trendPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trendPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend}
                </span>
                <span className="text-sm text-black ml-1">
                  vs. letzte Woche
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    );
  }
);

// Display name for debugging
StatsCard.displayName = "StatsCard";

export default StatsCard;
