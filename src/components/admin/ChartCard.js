"use client";

import { useState, memo, useCallback, useMemo } from "react";
import useAdminStore from "@/store/adminStore";

/**
 * ChartCard Component - ES6+ and Next.js 15 optimized
 * Modern chart component with Zustand state management
 * Supports line, bar and doughnut charts
 */
const ChartCard = memo(
  ({ title = "Chart", data = [], type = "line", className = "" }) => {
    const [selectedPeriod, setSelectedPeriod] = useState("7d");

    // Zustand store
    const loading = useAdminStore((state) => state.loading?.dashboard);

    // ES6+ Default data with arrow function
    const defaultData = useMemo(
      () => [
        { label: "Mo", value: 65 },
        { label: "Di", value: 59 },
        { label: "Mi", value: 90 },
        { label: "Do", value: 81 },
        { label: "Fr", value: 56 },
        { label: "Sa", value: 55 },
        { label: "So", value: 40 },
      ],
      []
    );

    // Memoized chart calculations
    const chartData = useMemo(
      () => (data.length > 0 ? data : defaultData),
      [data, defaultData]
    );

    const maxValue = useMemo(() => {
      if (!chartData || chartData.length === 0) return 1;
      const values = chartData
        .map((item) => item.value || 0)
        .filter((v) => !isNaN(v));
      return values.length > 0 ? Math.max(...values) : 1;
    }, [chartData]);

    const averageValue = useMemo(() => {
      if (!chartData || chartData.length === 0) return 0;
      const validValues = chartData
        .map((item) => item.value || 0)
        .filter((v) => !isNaN(v));
      return validValues.length > 0
        ? Math.round(
            validValues.reduce((sum, value) => sum + value, 0) /
              validValues.length
          )
        : 0;
    }, [chartData]);

    // ES6+ Event handler with useCallback
    const handlePeriodChange = useCallback((e) => {
      setSelectedPeriod(e.target.value);
    }, []);

    // ES6+ Arrow function components with memoization
    const SimpleLineChart = useCallback(() => {
      // Güvenli data kontrolü
      if (!chartData || chartData.length === 0) {
        return (
          <div className="h-48 w-full flex items-center justify-center">
            <p className="text-gray-400">Keine Daten verfügbar</p>
          </div>
        );
      }

      const points = chartData
        .map((item, index) => {
          const x = (index / (chartData.length - 1)) * 100 || 0;
          const y = 100 - ((item.value || 0) / (maxValue || 1)) * 80;
          return `${x},${y}`;
        })
        .join(" ");

      return (
        <div className="relative h-48 w-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.2"
              />
            ))}

            {/* Area under curve */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </linearGradient>
            </defs>

            <polygon points={`0,100 ${points} 100,100`} fill="url(#gradient)" />

            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="rgb(168, 85, 247)"
              strokeWidth="0.8"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {chartData.map((item, index) => {
              const x = (index / (chartData.length - 1)) * 100 || 0;
              const y = 100 - ((item.value || 0) / (maxValue || 1)) * 80;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1"
                  fill="rgb(168, 85, 247)"
                  className="drop-shadow-sm"
                />
              );
            })}
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-400">
            {chartData.map((item, index) => (
              <span key={index}>{item.label || `${index + 1}`}</span>
            ))}
          </div>
        </div>
      );
    }, [chartData, maxValue]);

    // ES6+ SimpleBarChart with useCallback
    const SimpleBarChart = useCallback(() => {
      // Güvenli data kontrolü
      if (!chartData || chartData.length === 0) {
        return (
          <div className="h-48 w-full flex items-center justify-center">
            <p className="text-gray-400">Keine Daten verfügbar</p>
          </div>
        );
      }

      return (
        <div className="h-48 w-full flex items-end justify-between px-4 py-4 space-x-2">
          {chartData.map((item, index) => {
            const value = item.value || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-md transition-all duration-500 hover:from-purple-400 hover:to-purple-300"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-2">
                  {item.label || `${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      );
    }, [chartData, maxValue]);

    // ES6+ SimpleDoughnutChart with useCallback
    const SimpleDoughnutChart = useCallback(() => {
      // Güvenli data kontrolü
      if (!chartData || chartData.length === 0) {
        return (
          <div className="h-48 w-full flex items-center justify-center">
            <p className="text-gray-400">Keine Daten verfügbar</p>
          </div>
        );
      }

      const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
      if (total === 0) {
        return (
          <div className="h-48 w-full flex items-center justify-center">
            <p className="text-gray-400">Keine Daten verfügbar</p>
          </div>
        );
      }

      let cumulativePercentage = 0;

      const colors = [
        "rgb(168, 85, 247)",
        "rgb(236, 72, 153)",
        "rgb(59, 130, 246)",
        "rgb(16, 185, 129)",
        "rgb(245, 158, 11)",
        "rgb(239, 68, 68)",
      ];

      return (
        <div className="h-48 w-full flex items-center justify-center">
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {chartData.map((item, index) => {
                const value = item.value || 0;
                const percentage = (value / total) * 100 || 0;
                const strokeDasharray = `${percentage * 3.77} 377`;
                const strokeDashoffset = -cumulativePercentage * 3.77;
                cumulativePercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
            </div>
          </div>
        </div>
      );
    }, [chartData]);

    // ES6+ Color palette for doughnut legend
    const chartColors = useMemo(
      () => [
        "rgb(168, 85, 247)",
        "rgb(236, 72, 153)",
        "rgb(59, 130, 246)",
        "rgb(16, 185, 129)",
        "rgb(245, 158, 11)",
        "rgb(239, 68, 68)",
      ],
      []
    );

    // Loading skeleton component
    if (loading) {
      return (
        <div
          className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 ${className}`}
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-700 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-white backdrop-blur-xl border border-transparent rounded-2xl p-7 relative transition-all duration-300 shadow-[0_2px_24px_0_rgba(168,85,247,0.12)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:transition-all before:duration-300 before:shadow-[0_0_32px_8px_rgba(168,85,247,0.18)] hover:before:shadow-[0_0_48px_12px_rgba(168,85,247,0.32)] hover:shadow-[0_4px_32px_0_rgba(168,85,247,0.22)] ${className}`}
      >
        {/* Header with ES6+ template literals and destructuring */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="7d">7 Tage</option>
              <option value="30d">30 Tage</option>
              <option value="90d">90 Tage</option>
            </select>
          </div>
        </div>

        {/* Chart rendering with conditional operators */}
        <div className="mb-4">
          {type === "line" && <SimpleLineChart />}
          {type === "bar" && <SimpleBarChart />}
          {type === "doughnut" && <SimpleDoughnutChart />}
        </div>

        {/* Doughnut chart legend with ES6+ destructuring */}
        {type === "doughnut" && (
          <div className="flex flex-wrap gap-4 justify-center">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="text-sm text-black">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats for line and bar charts with memoized average */}
        {(type === "line" || type === "bar") && (
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-900">
              Max: <span className="text-black">{maxValue}</span>
            </div>
            <div className="text-gray-900">
              Durchschnitt: <span className="text-black">{averageValue}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// ES6+ Display name for better debugging
ChartCard.displayName = "ChartCard";

export default ChartCard;
