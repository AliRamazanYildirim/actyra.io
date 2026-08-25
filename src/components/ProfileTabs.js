"use client";

import { User, Ticket, History, CalendarDays } from "lucide-react";

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "profil", label: "Profil", icon: User },
    { id: "tickets", label: "Meine Tickets", icon: Ticket },
    { id: "history", label: "Vergangene Events", icon: History },
    { id: "upcoming", label: "Kommende Events", icon: CalendarDays },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-pink-500/20"
                : "bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-500/50 hover:text-pink-500"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}