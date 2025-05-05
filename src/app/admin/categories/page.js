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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kategorien</h1>
        <Link href="/admin/categories/create">
          <Button>+ Kategorie hinzufügen</Button>
        </Link>
      </div>

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
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-md">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Icon</th>
                <th className="text-left px-4 py-2">Erstellungsdatum</th>
                <th className="text-left px-4 py-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t">
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">{cat.icon || '—'}</td>
                  <td className="px-4 py-2">
                    {format(new Date(cat.createdAt), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link href={`/admin/categories/${cat._id}/edit`}>
                      <Button variant="outline" size="sm">Bearbeiten</Button>
                    </Link>
                    <form
                      action={`/api/categories/${cat._id}`}
                      method="POST"
                      onSubmit={(e) => {
                        if (!confirm('Möchtest du diese Kategorie wirklich löschen?')) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="_method" value="DELETE" />
                      <Button type="submit" variant="destructive" size="sm">Löschen</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
