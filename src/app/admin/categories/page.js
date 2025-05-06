'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { categorySeedData } from '@/data/categorySeedData';
import { Button } from '@/components/ui/button';

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState(categorySeedData);

  const handleDelete = (id) => {
    if (!confirm('Möchtest du diese Kategorie wirklich löschen?')) return;
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
    <div className="min-h-screen bg-gray-100 py-24 px-4 sm:px-8 lg:px-24">
      <div className="w-full max-w-7xl mx-auto space-y-12 px-4">
        {/* Titel */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            🗂️ Kategorien verwalten
          </h1>
          <p className="text-gray-600">
            Hier kannst du neue Kategorien erstellen oder bestehende verwalten.
          </p>
        </div>

        {/* Button */}
        <div className="text-right">
          <Link href="/admin/categories/create">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-pink-500 hover:to-purple-600 transition">
              + Kategorie hinzufügen
            </Button>
          </Link>
        </div>

        {/* Tabelle */}
        <div className="bg-[#0f172a] rounded-2xl shadow-2xl overflow-x-auto border border-gray-800">
          <table className="min-w-full text-white rounded-lg overflow-hidden">
            <thead className="bg-[#1e293b] text-base">
              <tr>
                <th className="px-8 py-4 text-left">Name</th>
                <th className="px-8 py-4 text-left">Icon</th>
                <th className="px-8 py-4 text-left">Erstellt am</th>
                <th className="px-8 py-4 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-gray-700 hover:bg-gray-800/50 transition text-base"
                >
                  <td className="px-8 py-4">{cat.name}</td>
                  <td className="px-8 py-4">{cat.icon || '—'}</td>
                  <td className="px-8 py-4">
                    {format(new Date(cat.createdAt), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/admin/categories/${cat.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          Bearbeiten
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Löschen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => toggleActive(cat.id)}
                      >
                        {cat.isActive ? 'Deaktivieren' : 'Aktivieren'}
                      </Button>
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
