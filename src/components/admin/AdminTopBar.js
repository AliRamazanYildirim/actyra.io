"use client";

import { useState } from "react";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function AdminTopBar({ user, userRole }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-[#0f172a] border-b border-gray-800 px-4 lg:px-6 py-4 lg:relative fixed top-0 left-0 right-0 z-20 lg:z-auto">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md ml-16 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Events, Benutzer, Kategorien suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-white">
                {user?.fullName || user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-xs text-gray-400">
                {userRole === 'admin' ? 'Administrator' : 'Veranstalter'}
              </p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 lg:w-10 lg:h-10"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
