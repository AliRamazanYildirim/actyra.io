"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import useAdminStore from "@/store/adminStore";

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Zustand store
  const userRole = useAdminStore((state) => state.userRole);
  const setUserRole = useAdminStore((state) => state.setUserRole);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoaded && user) {
        // Tüm giriş yapmış kullanıcıları admin yapıyoruz
        setUserRole("admin");
        setLoading(false);
      } else if (isLoaded && !user) {
        router.push("/");
      }
    };

    checkUserRole();
  }, [user, isLoaded, router, setUserRole]);

  // Mount kontrolü - hydration güvenliği
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
      {/* Sidebar */}
      <AdminSidebar userRole={userRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminTopBar user={user} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
