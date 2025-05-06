'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Button } from '@/components/ui/button.js';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert.js';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Fehler beim Laden der Kategorien.');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-24 px-4 sm:px-8 lg:px-24">
      <div className="max-w-5xl mx-auto space-y-12">
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

        {/* Inhalt */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl overflow-x-auto border border-gray-800">
            <table className="min-w-full text-white rounded-lg overflow-hidden">
              <thead className="bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Icon</th>
                  <th className="px-6 py-4 text-left">Erstellt am</th>
                  <th className="px-6 py-4 text-left">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-t border-gray-700 hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">{cat.name}</td>
                    <td className="px-6 py-4">{cat.icon || '—'}</td>
                    <td className="px-6 py-4">{format(new Date(cat.createdAt), 'dd.MM.yyyy')}</td>
                    <td className="px-6 py-4 space-x-2 flex flex-wrap items-center">
                      {/* Bearbeiten */}
                      <Link href={`/admin/categories/${cat._id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-black hover:bg-gray-200"
                        >
                         Bearbeiten
                        </Button>
                      </Link>

                      {/* Löschen */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm('Möchtest du diese Kategorie wirklich löschen?')) return;
                          const res = await fetch(`/api/categories/${cat._id}`, {
                            method: 'DELETE',
                          });
                          if (res.ok) {
                            window.location.reload();
                          } else {
                            alert('Löschen fehlgeschlagen.');
                          }
                        }}
                      >
                        Löschen
                      </Button>

                      {/* Aktivieren / Deaktivieren */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={async () => {
                          const res = await fetch(`/api/categories/${cat._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isActive: !cat.isActive }),
                          });
                          if (res.ok) {
                            window.location.reload();
                          } else {
                            alert('Statusänderung fehlgeschlagen.');
                          }
                        }}
                      >
                        {cat.isActive ? 'Deaktivieren' : 'Aktivieren'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
