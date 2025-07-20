"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Edit, Trash2, Eye, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/admin/users?sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error("Fehler beim Ändern der Benutzerrolle:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Benutzers:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Benutzerverwaltung</h1>
        <Link href="/admin/users/create">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Benutzer hinzufügen
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nach Name oder E-Mail suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Alle Rollen</option>
            <option value="admin">Administrator</option>
            <option value="veranstalter">Veranstalter</option>
            <option value="user">Benutzer</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="createdAt-desc">Neueste zuerst</option>
            <option value="createdAt-asc">Älteste zuerst</option>
            <option value="fullName-asc">Name A-Z</option>
            <option value="fullName-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  E-Mail
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Rolle
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Registriert
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-[#1e293b]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.fullName?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {user.fullName || "Kein Name"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.role === "admin"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : user.role === "veranstalter"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      <option value="user">Benutzer</option>
                      <option value="veranstalter">Veranstalter</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {format(new Date(user.createdAt), "dd.MM.yyyy", {
                      locale: de,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        legacyBehavior
                      >
                        <a className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Keine Benutzer gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
