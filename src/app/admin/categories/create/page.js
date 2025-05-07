'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Kategorie erstellt:', {
        id: Date.now().toString(),
        name,
        icon,
        createdAt: new Date().toISOString(),
        isActive: true,
      });
      router.push('/admin/categories');
    }, 800);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center dark-light-mode px-4">
      <div className="w-full max-w-7xl bg-[#0f172a] text-white p-16 rounded-2xl shadow-2xl space-y-10">
        <h1 className="text-4xl font-bold text-center">
          Neue Kategorie erstellen
        </h1>

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
              className="w-full bg-white px-4 py-4 rounded-md"
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="ticket-button cursor-pointer">
              {loading ? "Wird gespeichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
