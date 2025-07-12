"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { categorySeedData } from "@/data/categorySeedData";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState(categorySeedData);

  const handleDelete = (id) => {
    if (!confirm("Möchtest du diese Kategorie wirklich löschen?")) return;
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const toggleActive = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Kategorien verwalten</h1>
        <Link href="/admin/categories/create">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Kategorie hinzufügen
          </button>
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Icon</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Erstellt am</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-[#1e293b]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {cat.icon || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(cat.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        cat.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {cat.isActive ? (
                        <>
                          <ToggleRight className="w-3 h-3 mr-1" />
                          Aktiv
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3 h-3 mr-1" />
                          Inaktiv
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {format(new Date(cat.createdAt), "dd.MM.yyyy", { locale: de })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href={`/admin/categories/${cat.id}/edit`}>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(cat.id)}
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
      </div>
    </div>
  );
}
