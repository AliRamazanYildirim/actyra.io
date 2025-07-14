"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import categories from "@/data/categories";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // Kategorie per API laden
  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      try {
        // Feste Kategorienliste direkt aus Datei
        const staticCategories = categories;
        if (staticCategories.includes(id)) {
          setName(
            id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          );
          setIcon("");
          setIsEditable(false);
          setError("");
        } else {
          const res = await fetch(`/api/admin/categories/${id}`);
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Kategorie nicht gefunden.");
          setName(data.name || "");
          setIcon(data.icon || "");
          setIsEditable(true);
          setError("");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern.");
      router.push("/admin/categories");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-600">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-gray-400">
        Lädt...
      </div>
    );
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#0d0e25] px-4">
    <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl space-y-8 border border-gray-800">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Kategorie bearbeiten</h1>
        <p className="text-gray-400 text-base">
          Hier kannst du Name und Icon deiner Kategorie ändern.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-200">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`w-full bg-white/80 text-black border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${!isEditable && "opacity-60 cursor-not-allowed"}`}
            disabled={!isEditable}
            placeholder="Kategoriename"
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-200">Icon <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={`w-full bg-white/80 text-black border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${!isEditable && "opacity-60 cursor-not-allowed"}`}
            disabled={!isEditable}
            placeholder="z.B. 🎵"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isEditable}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : isEditable
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-600 hover:to-blue-600"
              : "bg-yellow-500/20 text-yellow-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Wird gespeichert..." : "Änderungen speichern"}
        </button>
        {!isEditable && (
          <div className="flex items-center justify-center gap-2 text-yellow-400 mt-1 text-base font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01" /></svg>
            Feste Kategorien können nicht bearbeitet werden.
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 mt-2">{error}</div>
        )}
      </form>
    </div>
  </div>
);
}
