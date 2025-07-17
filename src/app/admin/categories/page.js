"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Kategorien aus der Datenbank abrufen
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Laden.");
        // Nur Datenbankkategorien anzeigen
        const dbCats = Array.isArray(data) ? data : [];
        setCategories(dbCats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Kategorie löschen (API)
  const handleDelete = async (id) => {
    if (!confirm("Möchtest du diese Kategorie wirklich löschen?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Löschen.");
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id && cat.id !== id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-10 text-gray-400">
          Kategorien werden geladen...
        </div>
      )}
      {error && <div className="text-center py-10 text-pink-400">{error}</div>}
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Kategorien verwalten</h1>
        <Link href="/admin/categories/create">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Kategorie hinzufügen
          </button>
        </Link>
      </div>

      {/* Kategorien Tabelle */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Icon
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Erstellt am
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {categories.map((cat) => (
                <tr
                  key={cat._id || cat.id}
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
                  <td className="px-6 py-4 text-gray-300">{cat.icon || "—"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(cat._id || cat.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        cat.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                      title={cat.isActive ? "Deaktivieren" : "Aktivieren"}
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
                    {cat.createdAt && cat.createdAt !== "" && !cat.isStatic
                      ? format(new Date(cat.createdAt), "dd.MM.yyyy", {
                          locale: de,
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                        title="Anzeigen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/categories/${cat._id || cat.id}/edit`}
                      >
                        <button
                          className="p-2 text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-600 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                          title="Bearbeiten"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline text-gray-300">
                            Bearbeiten
                          </span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(cat._id || cat.id)}
                        className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 hover:text-red-600 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                        title="Löschen"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Löschen</span>
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
