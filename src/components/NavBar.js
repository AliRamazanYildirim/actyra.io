"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { RiSearchEyeLine } from "react-icons/ri";
import ThemeToggle from "./ThemeToggle";
import useTicketStore from "@/store/ticketStore";

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [clientTicketCount, setClientTicketCount] = useState(0);
  const totalTicketCount = useTicketStore(state => state.getTotalTicketCount());
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

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

  useEffect(() => {
  // Erst nach dem Client-Rendering den echten Wert setzen
  setClientTicketCount(totalTicketCount);
}, [totalTicketCount]);

// Close mobile menu on resize

useEffect(() => {
  const closeMenuOnResize = () => {
    if (window.innerWidth >= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  window.addEventListener("resize", closeMenuOnResize);
  return () => window.removeEventListener("resize", closeMenuOnResize);
}, []);

  

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
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5"
            }
            backdrop-blur-xl bg-gradient-to-r from-[#0D0E25]/80 to-[#1c1f3c]/80 shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo - immer sichtbar */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-actyra.png"
            alt="Actyra Logo"
            width={40}
            height={40}
            priority
            className="rounded-full shadow-md hover:scale-105 transition"
          />
          <span className="text-white font-bold text-lg hidden sm:inline">
            Actyra
          </span>
        </Link>

        {/* 🔍 Suchleiste - nur auf Desktop sichtbar */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
          <span className="bg-white bg-opacity-10 rounded-md flex items-center w-full backdrop-blur-sm">
            <input
              type="text"
              placeholder="Nach Events suchen"
              className="py-2 px-4 bg-transparent text-black placeholder-gray-600 outline-none flex-1 text-sm"
            />
            <div className="h-6 w-[1px] bg-gray-400 mx-1"></div>
            <input
              type="text"
              placeholder="Stadt oder PLZ"
              className="py-2 px-4 bg-transparent text-black placeholder-gray-600 outline-none flex-1 text-sm"
            />
            <button
              className="bg-pink-600 hover:bg-pink-700 transition p-3 rounded-r-md cursor-pointer"
              aria-label="Suchen"
            >
              <RiSearchEyeLine />
            </button>
          </span>
        </div>

        {/* Desktop-Navigation - nur auf Desktop sichtbar */}
        <ul className="hidden md:flex flex-wrap justify-between mt-1 gap-4 text-white font-semibold text-sm">
          <li>
            <Link href="/" className={`nav-link ${isActive("home")}`}>
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => handleScrollTo("events")}
              className={`nav-link ${isActive("events")}`}
            >
              Events entdecken
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScrollTo("kategorien")}
              className={`nav-link ${isActive("kategorien")}`}
            >
              Kategorien
            </button>
          </li>
          <li>
            <Link
              href="/event-erstellen"
              className={`nav-link ${linkStyle("/event-erstellen")}`}
            >
              Event erstellen
            </Link>
          </li>
          <SignedOut>
            <>
              <li>
                <SignInButton mode="redirect" redirecturl="/sign-in">
                  <button className={`nav-link ${linkStyle("/sign-in")}`}>
                    Login
                  </button>
                </SignInButton>
              </li>
              <li>
                <SignUpButton mode="modal">
                  <button className={`nav-link ${linkStyle("/sign-up")}`}>
                    Registrieren
                  </button>
                </SignUpButton>
              </li>
            </>
          </SignedOut>
          {/* Profil-Schaltfläche - nur für eingeloggte Benutzer sichtbar */}
          <SignedIn>
            <li>
              <Link
                href="/profil"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link text-white"
              >
                Mein Profil
              </Link>
            </li>
            <li>
              <Link href="/warenkorb" className="relative group">
                <ShoppingCart className="w-6 h-6 text-white group-hover:text-pink-400 transition" />
                {clientTicketCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {clientTicketCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <UserButton />
            </li>
          </SignedIn>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile Buttons - rechts */}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden nav-text relative"
          aria-label="Menü öffnen"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          {clientTicketCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {clientTicketCount}
            </span>
          )}
        </button>
      </div>

      {/* 🔽 Mobiles Menü - Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`fixed top-0 left-0 w-full z-10 transition-all duration-700 ease-in-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-5"
              }
              backdrop-blur-xl bg-gradient-to-r from-[#070815]/95 to-[#121430]/95 shadow-md`}
        >
          {/* Menü-Header mit Schließen-Button */}
          <div className="py-4 text-center border-b border-gray-800">
            <h2 className="text-white text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 nav-text"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menü-Links - rechts ausgerichtet mit 15px Abstand */}
          <div className="flex flex-col items-end justify-start px-6 py-4 space-y-[15px] text-lg font-medium">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-link text-white"
            >
              Startseite
            </Link>

            {/* Profil-Schaltfläche - jeder kann sie sehen, aber nur angemeldete Benutzer können sie verwenden */}
            <Link
              href={isSignedIn ? "/profil" : "/sign-up"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-link text-white"
            >
              Mein Profil
            </Link>

            <button
              onClick={() => {
                handleScrollTo("events");
                setIsMobileMenuOpen(false);
              }}
              className="nav-link nav-text"
            >
              Events entdecken
            </button>

            <Link
              href={isSignedIn ? "/event-erstellen" : "/sign-up"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-link nav-text"
            >
              Event erstellen
            </Link>

            <button
              onClick={() => {
                handleScrollTo("kategorien");
                setIsMobileMenuOpen(false);
              }}
              className="nav-link nav-text"
            >
              Kategorien
            </button>

            {/* Auth-Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="nav-link nav-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  className="nav-link nav-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrieren
                </button>
              </SignUpButton>
            </SignedOut>

            {/* Warenkorb - nur für eingeloggte Benutzer sichtbar */}
            <SignedIn>
              <Link
                href="/warenkorb"
                className="nav-link text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Warenkorb
                {clientTicketCount > 0 && (
                  <span className="absolute -top-1 -right-4 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {clientTicketCount}
                  </span>
                )}
              </Link>
            </SignedIn>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
