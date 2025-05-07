'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { categorySeedData } from '@/data/categorySeedData';

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  // Kategorie aus statischer Seed-Datei finden
  const category = categorySeedData.find((c) => c.id === id);

  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Kategorie aktualisiert:', {
        id,
        name,
        icon,
        createdAt: category.createdAt,
        isActive: category.isActive,
      });
      router.push('/admin/categories');
    }, 800);
  };

  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-600">
        Kategorie nicht gefunden.
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center dark-light-mode px-4">
      <div className="w-full max-w-7xl bg-[#0f172a] text-white p-16 rounded-2xl shadow-2xl space-y-10">
        <h1 className="text-4xl font-bold text-center">Kategorie bearbeiten</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-2 text-lg">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white text-black border border-gray-300 px-4 py-4 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Icon (optional)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-white text-black border px-4 py-4 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ticket-button cursor-pointer"
          >
            {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
        </form>
      </div>
    </div>
  );
}
