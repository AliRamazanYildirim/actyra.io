'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';

export default function CreateCategoryPage() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon }),
      });
      if (!res.ok) throw new Error('Fehler beim Erstellen.');
      router.push('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-24 px-4 sm:px-8 lg:px-24">
      <div className="max-w-xl mx-auto bg-[#0f172a] text-white p-8 rounded-2xl shadow-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center">Kategorie erstellen</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block mb-2">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg"
            />
          </div>
          <div>
            <Label className="block mb-2">Icon (optional)</Label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white py-3 rounded-xl transition"
            disabled={loading}
          >
            {loading ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  );
}
