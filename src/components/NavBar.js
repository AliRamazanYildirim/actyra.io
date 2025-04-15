"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          }
        },
        { threshold: 0.6 }
      );

      const sections = ["home", "events", "kategorien"];
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [pathname]);

  const handleScrollTo = (id) => {
    setIsMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const linkStyle = (targetPath) =>
    `hover:text-pink-400 transition cursor-pointer ${
      pathname === targetPath ? "text-pink-400 font-semibold" : ""
    }`;

  const isActive = (sectionId) =>
    pathname === "/" && activeSection === sectionId
      ? "text-pink-400 font-semibold"
      : "hover:text-pink-400 transition cursor-pointer";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
        backdrop-blur-xl bg-gradient-to-r from-[#0D0E25]/80 to-[#1c1f3c]/80 shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🔷 Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-actyra.png"
            alt="Actyra Logo"
            width={40}
            height={40}
            className="rounded-full shadow-md hover:scale-105 transition"
          />
          <span className="text-white font-bold text-lg hidden sm:inline">Actyra</span>
        </Link>

        {/* 🔷 Desktop Menü */}
        <ul className="hidden md:flex flex-wrap justify-center gap-8 text-white font-semibold text-sm md:text-base">
          <li>
            <Link href="/" className={isActive("home")}>
              Startseite
            </Link>
          </li>
          <li>
            <button onClick={() => handleScrollTo("events")} className={isActive("events")}>
              Events entdecken
            </button>
          </li>
          <li>
            <button onClick={() => handleScrollTo("kategorien")} className={isActive("kategorien")}>
              Kategorien
            </button>
          </li>
          <li>
            <Link href="/event-erstellen" className={linkStyle("/event-erstellen")}>Event erstellen</Link>
          </li>
        </ul>

        {/* 🔷 Icons rechts */}
        <div className="flex items-center gap-5  text-white font-semibold text-sm md:text-base">
          <Link href="/login" className={linkStyle("/login")}>
            Mein Bereich
          </Link>

          <Link href="/warenkorb" className="relative group">
            <ShoppingCart className="w-6 h-6 text-white group-hover:text-pink-400 transition" />
          </Link>

          {/* Mobile Burger Menü */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
            aria-label="Menü öffnen"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🔽 Mobiles Menü */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1c1f3c] text-white text-center py-4 space-y-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive("home")}>
            Startseite
          </Link>
          <button onClick={() => handleScrollTo("events")} className={isActive("events")}>
            Events entdecken
          </button>
          <button onClick={() => handleScrollTo("kategorien")} className={isActive("kategorien")}>
            Kategorien
          </button>
          <Link href="/event-erstellen" onClick={() => setIsMobileMenuOpen(false)} className={linkStyle("/event-erstellen")}>
            Event erstellen
          </Link>
        </div>
      )}
    </nav>
  );
}
