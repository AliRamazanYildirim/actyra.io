"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", role: "user" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) throw new Error("Benutzer nicht gefunden");
        const data = await res.json();
        if (!data || !data.user) {
          throw new Error("Benutzerdaten konnten nicht geladen werden");
        }
        setUser(data.user);
        setForm({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          role: data.user.role || "user",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      router.push("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-pulse h-8 w-1/3 bg-gray-700 rounded mb-4"></div>
        <div className="animate-pulse h-16 w-2/3 bg-gray-700 rounded"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 py-12">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#0f172a] border border-gray-800 rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Benutzer bearbeiten
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">E-Mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Rolle</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="user">Benutzer</option>
            <option value="veranstalter">Veranstalter</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-8">
          <Link href="/admin/users" className="text-gray-400 hover:text-white">
            Zurück
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 font-semibold disabled:opacity-60"
          >
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
