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
        try {
          // Gerçek kullanıcı rolünü veritabanından çek
          const response = await fetch("/api/user/profile");

          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);

            // Admin değilse ana sayfaya yönlendir
            if (userData.role !== "admin") {
              console.log(
                "Kullanıcı admin değil, ana sayfaya yönlendiriliyor..."
              );
              router.push("/");
              return;
            }
          } else if (response.status === 404) {
            // Kullanıcı DB'de yok - GEÇİCİ ÇÖZÜM: İlk kullanıcıya admin yetkisi ver
            console.log(
              "Kullanıcı DB'de bulunamadı, ilk kullanıcı olarak admin yetkisi veriliyor..."
            );

            try {
              const createResponse = await fetch("/api/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  clerkId: user.id,
                  email: user.emailAddresses[0]?.emailAddress,
                  fullName:
                    user.fullName || user.firstName + " " + user.lastName,
                  role: "admin", // GEÇİCİ: İlk kullanıcıya admin yetkisi
                }),
              });

              if (createResponse.ok) {
                const newUserData = await createResponse.json();
                setUserRole("admin");
                console.log("✅ Yeni kullanıcı admin olarak oluşturuldu");
              } else {
                console.error("Kullanıcı oluşturulamadı");
                router.push("/");
                return;
              }
            } catch (createError) {
              console.error("Kullanıcı oluşturma hatası:", createError);
              router.push("/");
              return;
            }
          } else {
            console.error(
              "API yanıt hatası:",
              response.status,
              response.statusText
            );
            router.push("/");
            return;
          }
        } catch (error) {
          console.error("API çağrısı hatası:", error);
          router.push("/");
          return;
        }
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
