"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Bitte geben Sie einen Kategorienamen ein.");
      nameInputRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Speichern.");
        setLoading(false);
        return;
      }
      router.push("/admin/categories");
    } catch (err) {
      setError("Serverfehler. Bitte versuchen Sie es später erneut.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d0e25] px-4">
      <section className="w-full max-w-md bg-[#10172a] text-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">
          Neue Kategorie erstellen
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label
              htmlFor="category-name"
              className="block mb-2 text-base font-medium"
            >
              Name <span className="text-pink-500">*</span>
            </label>
            <input
              id="category-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="z.B. Bildung, Sport, Musik..."
              className="w-full bg-[#181c2a] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 px-4 py-3 rounded-lg transition-all duration-200 outline-none"
              aria-invalid={!!error}
              aria-describedby="category-name-error"
            />
            {error && (
              <p
                id="category-name-error"
                className="mt-2 text-sm text-pink-400"
              >
                {error}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="category-icon"
              className="block mb-2 text-base font-medium"
            >
              Icon (optional)
            </label>
            <input
              id="category-icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="z.B. fa-music, fa-sport"
              className="w-full bg-[#181c2a] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 px-4 py-3 rounded-lg transition-all duration-200 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Wird gespeichert...
              </span>
            ) : (
              "Speichern"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
