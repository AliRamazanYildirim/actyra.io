"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Ticket,
  Tags,
  Receipt,
  // Menu, // Buradan kaldırıldı
  // X, // Buradan kaldırıldı
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    roles: ["admin", "veranstalter"],
  },
  {
    title: "Events",
    icon: Calendar,
    roles: ["admin", "veranstalter"],
    children: [
      { title: "Alle Events", href: "/admin/events" },
      { title: "Event erstellen", href: "/admin/events/create" },
      { title: "Event-Statistiken", href: "/admin/events/stats" },
    ],
  },
  {
    title: "Tickets",
    icon: Ticket,
    roles: ["admin", "veranstalter"],
    children: [
      { title: "Alle Tickets", href: "/admin/tickets" },
      { title: "Verkaufsstatistiken", href: "/admin/tickets/stats" },
    ],
  },
  {
    title: "Kategorien",
    icon: FolderOpen,
    roles: ["admin"],
    children: [
      { title: "Alle Kategorien", href: "/admin/categories" },
      { title: "Kategorie erstellen", href: "/admin/categories/create" },
    ],
  },
  {
    title: "Benutzer",
    icon: Users,
    href: "/admin/users",
    roles: ["admin"],
  },
  {
    title: "Finanzen",
    icon: Receipt,
    roles: ["admin", "veranstalter"],
    children: [
      { title: "Umsätze", href: "/admin/finance/revenue" },
      { title: "Zahlungen", href: "/admin/finance/payments" },
      { title: "Berichte", href: "/admin/finance/reports" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    roles: ["admin", "veranstalter"],
  },
  {
    title: "Einstellungen",
    icon: Settings,
    href: "/admin/settings",
    roles: ["admin"],
  },
];

// isMobileMenuOpen ve setIsMobileMenuOpen proplarını alacak şekilde güncellendi
export default function AdminSidebar({ userRole, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [expandedItems, setExpandedItems] = useState({});
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Bu satır kaldırıldı
  const pathname = usePathname();

  const toggleExpanded = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    // Exact match için - sadece tam eşleşmelerde aktif olsun
    return pathname === href;
  };

  const renderMenuItem = (item) => {
    if (!item.roles.includes(userRole)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title];

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.title)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1e293b] rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`block px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                    isActive(child.href)
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1e293b]"
                  }`}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
          isActive(item.href)
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            : "text-gray-300 hover:text-white hover:bg-[#1e293b]"
        }`}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button ve Overlay buraya taşındığı için bu kısımlar kaldırıldı */}
      {/* <button ... /> */}
      {/* {isMobileMenuOpen && <div ... />} */}

      {/* Sidebar */}
      <div
        className={`
          w-64 bg-[#0f172a] border-r border-gray-800 flex flex-col
          fixed left-0 top-0 h-full z-40
          ${
            isMobileMenuOpen
              ? "translate-x-0" // Mobil menü açıkken tamamen görünür (soldan içeri kaydırılır)
              : "-translate-x-full lg:translate-x-0" // Mobil menü kapalıyken soldan gizlenir, ancak büyük ekranlarda (lg) yine de görünür (sabit)
          }
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Actyra
            </span>
            <span className="text-sm font-normal text-gray-400 block mt-1">
              Admin Panel
            </span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">{sidebarItems.map(renderMenuItem)}</div>
        </nav>

        {/* User Role Badge */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                userRole === "admin"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {userRole === "admin" ? "Administrator" : "Veranstalter"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}