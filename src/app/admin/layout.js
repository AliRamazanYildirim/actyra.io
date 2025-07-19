"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { Loader2, Menu, X } from "lucide-react"; 
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import useAdminStore from "@/store/adminStore";

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Zustand Store
  const userRole = useAdminStore((state) => state.userRole);
  const setUserRole = useAdminStore((state) => state.setUserRole);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoaded && user) {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setUserRole(data.role);
          } else {
            setUserRole(undefined);
          }
        } catch (err) {
          setUserRole(undefined);
        }
        setLoading(false);
      } else if (isLoaded && !user) {
        router.push("/");
      }
    };

    checkUserRole();
  }, [user, isLoaded, router, setUserRole]);

  // Mount-Kontrolle - Hydration-Sicherheit
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#0D0E25] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">
            Authentifizierung wird überprüft...
          </p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0E25] flex" suppressHydrationWarning>
      {/* Mobile Menu Button - Layout-Ebene verwaltet. */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f172a] border border-gray-800 rounded-lg text-white"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay - Layout-Ebene verwaltet. */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Seitenleiste */}
      <AdminSidebar
        userRole={userRole}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Hauptinhalt */}
      {/* lg:ml-64 wird nur auf großen Bildschirmen angewendet, bei geöffnetem mobilen Menü (isMobileMenuOpen) gibt es keinen Abstand. */}
      <div
        className={`flex-1 flex flex-col ${isMobileMenuOpen ? "" : "lg:ml-64"}`}
      >
        <AdminTopBar user={user} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
