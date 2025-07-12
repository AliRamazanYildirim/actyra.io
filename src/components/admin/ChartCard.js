"use client";

import { useState } from "react";

export default function ChartCard({ title, data = [], type = "line" }) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Default data if none provided
  const defaultData = [
    { label: "Mo", value: 65 },
    { label: "Di", value: 59 },
    { label: "Mi", value: 90 },
    { label: "Do", value: 81 },
    { label: "Fr", value: 56 },
    { label: "Sa", value: 55 },
    { label: "So", value: 40 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData.map((item) => item.value));

  const SimpleLineChart = () => {
    const points = chartData
      .map((item, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 80;
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
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80;
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
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const SimpleBarChart = () => {
    return (
      <div className="h-48 w-full flex items-end justify-between px-4 py-4 space-x-2">
        {chartData.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-md transition-all duration-500 hover:from-purple-400 hover:to-purple-300"
                  style={{ height: `${height}%`, minHeight: "4px" }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-2">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const SimpleDoughnutChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

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
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 3.77} 377`;
              const strokeDashoffset = -cumulativePercentage * 3.77;
              cumulativePercentage += percentage;

              const colors = [
                "rgb(168, 85, 247)",
                "rgb(236, 72, 153)",
                "rgb(59, 130, 246)",
                "rgb(16, 185, 129)",
                "rgb(245, 158, 11)",
                "rgb(239, 68, 68)",
              ];

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
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="7d">7 Tage</option>
            <option value="30d">30 Tage</option>
            <option value="90d">90 Tage</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        {type === "line" && <SimpleLineChart />}
        {type === "bar" && <SimpleBarChart />}
        {type === "doughnut" && <SimpleDoughnutChart />}
      </div>

      {/* Legend for doughnut chart */}
      {type === "doughnut" && (
        <div className="flex flex-wrap gap-4 justify-center">
          {chartData.map((item, index) => {
            const colors = [
              "rgb(168, 85, 247)",
              "rgb(236, 72, 153)",
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
            ];

            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats for line and bar charts */}
      {(type === "line" || type === "bar") && (
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-400">
            Max: <span className="text-white">{maxValue}</span>
          </div>
          <div className="text-gray-400">
            Durchschnitt:{" "}
            <span className="text-white">
              {Math.round(
                chartData.reduce((sum, item) => sum + item.value, 0) /
                  chartData.length
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
