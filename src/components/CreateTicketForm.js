"use client";
import { useState } from "react";

export default function CreateTicketForm() {
  const [form, setForm] = useState({
    title: "",
    price: 0,
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // später hier: fetch/axios POST to DB
    console.log("Ticket erstellt:", form);
    alert(`✅ Ticket "${form.title}" wurde erstellt.`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0f172a] text-white p-6 rounded-xl shadow-lg max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold text-pink-500">Neues Ticket erstellen</h2>

      <div>
        <label className="block mb-1 text-sm">Titel</label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Preis (€)</label>
        <input
          type="number"
          name="price"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Beschreibung</label>
        <textarea
          name="description"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full font-semibold"
      >
        Ticket erstellen
      </button>
    </form>
  );
}
