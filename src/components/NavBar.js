"use client";

import Link from "next/link";
import { useEffect, useState, memo, useCallback, useMemo, useRef } from "react";
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
import { ChevronDownIcon } from "@heroicons/react/24/solid";

/**
 * NavBar Component - ES6+ and Next.js 15 optimized
 * Modern navigation with React.memo, useCallback, and ES6+ patterns
 */
const NavBar = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [clientTicketCount, setClientTicketCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ES6+ Zustand-Store-Selektoren mit Memoisierung
  const cartTickets = useTicketStore((state) => state.cartTickets || []);

  // Ereignisstatus für die Suche
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);

  // Hole dich die Events vom Backend (einmal beim ersten Laden), mit fallbackEvents.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events");
        const data = res.ok ? await res.json() : null;
        const events = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data)
          ? data
          : [];
        setAllEvents(
          events.length
            ? events
            : (await import("@/data/eventSeedData")).default
        );
      } catch {
        setAllEvents((await import("@/data/eventSeedData")).default);
      }
    })();
  }, []);

  // Filtere, während sich die Sucheingabe ändert (flexibler und mit Debugging).
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allEvents.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.slug || "").toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 8));
    setShowDropdown(true);
  }, [searchTerm, allEvents]);

  // ES6+ useMemo for computed values
  const totalTicketCount = useMemo(
    () =>
      Array.isArray(cartTickets)
        ? cartTickets.reduce((sum, ticket) => sum + (ticket?.quantity || 0), 0)
        : 0,
    [cartTickets]
  );

  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  // Rolle des Benutzers laden, wenn eingeloggt
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      }
    };
    if (isSignedIn) fetchRole();
    else setUserRole(null);
  }, [isSignedIn]);

  // ES6+ Initialization effect with arrow function
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // ES6+ Client-side ticket count synchronization
  useEffect(() => {
    // Set real value after client rendering only when tickets is an array
    if (Array.isArray(cartTickets)) {
      setClientTicketCount(totalTicketCount);
    }
  }, [totalTicketCount, cartTickets]);

  // ES6+ Intersection Observer for section tracking
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // ES6+ for...of loop with early return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.6 }
    );

    // ES6+ Array methods and optional chaining
    const sections = ["home", "events", "kategorien"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // ES6+ Mobile menu resize handler
  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnResize);
    return () => window.removeEventListener("resize", closeMenuOnResize);
  }, []);

  // ES6+ Event handlers with useCallback
  const handleScrollTo = useCallback(
    (id) => {
      setIsMobileMenuOpen(false);
      if (pathname !== "/") {
        router.push(`/#${id}`);
      } else {
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname, router]
  );

  // ES6+ Link styling function with template literals
  const linkStyle = useCallback(
    (targetPath) =>
      `hover:text-pink-400 transition cursor-pointer ${
        pathname === targetPath ? "text-pink-400 font-semibold" : ""
      }`,
    [pathname]
  );

  // ES6+ Section active state checker
  const isActive = useCallback(
    (sectionId) =>
      pathname === "/" && activeSection === sectionId
        ? "text-pink-400 font-semibold"
        : "hover:text-pink-400 transition cursor-pointer",
    [pathname, activeSection]
  );

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
        <div
          className="hidden md:flex items-center flex-1 max-w-xl mx-6 relative"
          style={{ zIndex: 60 }}
        >
          <div className="w-full relative">
            <span className="bg-white bg-opacity-10 rounded-md flex items-center w-full backdrop-blur-sm">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Nach Events suchen"
                className="py-2 px-4 bg-transparent text-black placeholder-gray-600 outline-none flex-1 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                autoComplete="off"
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
                onClick={() => {
                  if (searchResults.length > 0) {
                    router.push(
                      `/events/${searchResults[0].slug || searchResults[0].id}`
                    );
                    setShowDropdown(false);
                  }
                }}
              >
                <RiSearchEyeLine />
              </button>
            </span>
            {/* Dropdown-Ereignis-Suchergebnisse */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 top-12 w-full bg-white rounded-b-lg shadow-xl z-[999] border border-pink-400/30 max-h-80 overflow-y-auto animate-fadeIn">
                {searchResults.map((event, index) => {
                  // Bildquelle flexibel wählen
                  const imgSrc =
                    event.image || event.imageUrl || "/event-default.webp";
                  // Key möglichst eindeutig
                  const key = event.id || event._id || event.slug || index;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-pink-100 cursor-pointer text-black border-b last:border-b-0 border-gray-100"
                      onMouseDown={() => {
                        router.push(
                          `/events/${
                            event.slug || event.id || event._id || index
                          }`
                        );
                        setShowDropdown(false);
                        setSearchTerm("");
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={event.title}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover rounded-md border border-gray-200"
                      />
                      <span className="font-medium text-sm line-clamp-1">
                        {event.title}
                      </span>
                    </div>
                  );
                })}
                {searchResults.length === 8 && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    Begrenze die Suche für weitere Ergebnisse...
                  </div>
                )}
              </div>
            )}
          </div>
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
            <li
              className="relative"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                className="text-white flex items-center gap-1 focus:outline-none cursor-pointer"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                Mein Profil
              </button>
              {/* Dropdown für Profil und ggf. Admin Dashboard */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-4 w-56 bg-gradient-to-b from-[#23244a] to-[#181a2b] border border-pink-600/30 rounded-2xl shadow-2xl z-50 flex flex-col items-center pt-4 pb-3 animate-fadeIn"
                  style={{ right: "-85px" }}
                >
                  {/* ChevronDownIcon tam ortada ve üstte */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#23244a] to-[#181a2b] rounded-full p-1 border border-pink-600/30 shadow-lg flex items-center justify-center">
                    <ChevronDownIcon className="w-7 h-7 text-pink-400 drop-shadow" />
                  </div>
                  <Link
                    href="/profil"
                    className="w-5/6 text-center px-4 py-2 text-base text-white rounded-lg hover:bg-pink-500/20 transition mb-1"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Mein Profil
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="w-5/6 text-center px-4 py-2 text-base text-white rounded-lg hover:bg-pink-500/20 transition"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              )}
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
});

// ES6+ Display name for debugging
NavBar.displayName = "NavBar";

export default NavBar;
