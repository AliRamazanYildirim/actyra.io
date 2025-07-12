"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Routenüberprüfung
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

 // Rendern Sie in Admin-Routen nur die Children (hat eigenes Layout)
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Auth-Routen nur die Children rendern (hat eigenes Layout)
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Normale öffentliche Seiten mit NavBar und Footer rendern
  return (
    <>
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
