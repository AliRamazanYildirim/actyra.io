"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendPositive, 
  bgColor = "bg-purple-500/10",
  iconColor = "text-purple-500" 
}) {
  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trendPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                trendPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend}
              </span>
              <span className="text-sm text-gray-400 ml-1">vs. letzte Woche</span>
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
