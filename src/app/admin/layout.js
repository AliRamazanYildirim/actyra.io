"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration hatalarını önlemek için mount kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoaded && user) {
        // GEÇICI: Tüm giriş yapmış kullanıcıları admin olarak tanı
        setUserRole('admin');
        setLoading(false);
        return;
        
        /* ASIL KOD (SONRA AKTİF EDİLECEK):
        try {
          // Benutzer-Rolle aus der Datenbank abrufen
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const userData = await response.json();
            if (userData.role === 'admin' || userData.role === 'veranstalter') {
              setUserRole(userData.role);
            } else {
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzerrolle:', error);
          router.push('/');
        }
        */
      } else if (isLoaded && !user) {
        router.push('/');
      }
      setLoading(false);
    };

    if (mounted) {
      checkUserRole();
    }
  }, [user, isLoaded, router, mounted]);

  // Mount kontrolü - hydration güvenliği
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0D0E25] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#0D0E25] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0E25] flex" suppressHydrationWarning>
      {/* Sidebar */}
      <AdminSidebar userRole={userRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminTopBar user={user} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
