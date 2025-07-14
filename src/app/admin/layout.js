"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // useState buraya eklendi
import { Loader2, Menu, X } from "lucide-react"; // Menu ve X buraya eklendi
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import useAdminStore from "@/store/adminStore";

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // isMobileMenuOpen state'i buraya taşındı

  // Zustand Store
  const userRole = useAdminStore((state) => state.userRole);
  const setUserRole = useAdminStore((state) => state.setUserRole);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoaded && user) {
        try {
          // Echte Benutzerrolle aus der Datenbank abrufen
          const response = await fetch("/api/user/profile");

          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);

            // Wenn nicht Admin, zur Startseite weiterleiten
            if (userData.role !== "admin" && userData.role !== "veranstalter") { // Both admin and veranstalter can access admin panel based on sidebar config
              console.log(
                "Benutzer ist kein Admin/Veranstalter, wird zur Startseite weitergeleitet..."
              );
              router.push("/");
              return;
            }
          } else if (response.status === 404) {
            // Benutzer nicht in DB - VORÜBERGEHENDE LÖSUNG: Erstem Benutzer Adminrechte geben
            console.log(
              "Benutzer nicht in der Datenbank gefunden, erster Benutzer erhält Adminrechte..."
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
                  role: "admin", // VORÜBERGEHEND: Erster Benutzer erhält Adminrechte
                }),
              });

              if (createResponse.ok) {
                const newUserData = await createResponse.json();
                setUserRole("admin");
                console.log("✅ Neuer Benutzer wurde als Admin erstellt");
              } else {
                console.error("Benutzer konnte nicht erstellt werden");
                router.push("/");
                return;
              }
            } catch (createError) {
              console.error("Fehler beim Erstellen des Benutzers:", createError);
              router.push("/");
              return;
            }
          } else {
            console.error(
              "API Antwortfehler:",
              response.status,
              response.statusText
            );
            router.push("/");
            return;
          }
        } catch (error) {
          console.error("Fehler beim API-Aufruf:", error);
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
      {/* Mobile Menu Button - Layout seviyesinde yönetiliyor */}
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

      {/* Mobile Overlay - Layout seviyesinde yönetiliyor */}
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
      {/* lg:ml-64 sadece büyük ekranlarda uygulanır, mobil menü açıkken (isMobileMenuOpen) boşluk olmaz */}
      <div className={`flex-1 flex flex-col ${isMobileMenuOpen ? '' : 'lg:ml-64'}`}>
        <AdminTopBar user={user} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}