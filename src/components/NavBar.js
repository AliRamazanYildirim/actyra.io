"use client";

import Link from "next/link";
import { useEffect, useState, memo, useCallback, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  MapPin,
  Sparkles,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import useTicketStore from "@/store/ticketStore";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {
  ssr: false,
  loading: () => (
    <div className="w-18 h-9 rounded-full bg-slate-200/60 dark:bg-[#0f122e] border border-slate-300/40 dark:border-slate-800" />
  ),
});

const NavBar = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [clientTicketCount, setClientTicketCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const cartTickets = useTicketStore((state) => state.cartTickets || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);

  // Fetch events once for client search
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
            : (await import("@/data/eventSeedData")).default,
        );
      } catch {
        setAllEvents((await import("@/data/eventSeedData")).default);
      }
    })();
  }, []);

  // Filter search results
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allEvents.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      const category = (e.category || "").toLowerCase();
      return title.includes(q) || location.includes(q) || category.includes(q);
    });
    setSearchResults(filtered.slice(0, 6));
    setShowDropdown(true);
  }, [searchTerm, allEvents]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalTicketCount = useMemo(
    () =>
      Array.isArray(cartTickets)
        ? cartTickets.reduce((sum, ticket) => sum + (ticket?.quantity || 0), 0)
        : 0,
    [cartTickets],
  );

  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Load user role
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

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (Array.isArray(cartTickets)) {
      setClientTicketCount(totalTicketCount);
    }
  }, [totalTicketCount, cartTickets]);

  // Track active section on homepage
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.5 },
    );

    const sections = ["home", "events", "kategorien"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Handle mobile menu auto-close on resize
  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", closeMenuOnResize);
    return () => window.removeEventListener("resize", closeMenuOnResize);
  }, []);

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
    [pathname, router],
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } backdrop-blur-xl bg-white/95 dark:bg-[#070818]/95 border-b border-slate-200/60 dark:border-slate-800/80 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo-actyra.png"
              alt="Actyra Logo"
              fill
              sizes="40px"
              priority
              className="object-cover"
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Actyra
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div
          className="hidden md:flex flex-1 max-w-md mx-4 relative"
          ref={searchInputRef}
        >
          <div className="w-full relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Events, Orte, Kategorien suchen..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
              autoComplete="off"
              suppressHydrationWarning
            />
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 top-12 w-full bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto animate-fadeIn z-50 p-2 space-y-1">
              {searchResults.map((event) => {
                const imgSrc =
                  event.imageUrl || event.image || "/images/event-default.webp";
                return (
                  <div
                    key={event.slug || event._id || event.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1d42] cursor-pointer transition-colors"
                    onMouseDown={() => {
                      router.push(`/events/${event.slug || event.id}`);
                      setShowDropdown(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={imgSrc}
                        alt={event.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {event.title}
                      </span>
                      {event.location && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-500 inline shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Link
            href="/"
            className={`transition-colors hover:text-pink-500 ${
              pathname === "/" && activeSection === "home"
                ? "text-pink-500 font-semibold"
                : ""
            }`}
          >
            Home
          </Link>

          <button
            onClick={() => handleScrollTo("events")}
            className={`transition-colors hover:text-pink-500 cursor-pointer ${
              pathname === "/" && activeSection === "events"
                ? "text-pink-500 font-semibold"
                : ""
            }`}
          >
            Events
          </button>

          <button
            onClick={() => handleScrollTo("kategorien")}
            className={`transition-colors hover:text-pink-500 cursor-pointer ${
              pathname === "/" && activeSection === "kategorien"
                ? "text-pink-500 font-semibold"
                : ""
            }`}
          >
            Kategorien
          </button>

          <Link
            href="/event-erstellen"
            className={`transition-colors hover:text-pink-500 ${
              pathname === "/event-erstellen"
                ? "text-pink-500 font-semibold"
                : ""
            }`}
          >
            Event erstellen
          </Link>
        </nav>

        {/* Action Controls (Divider, Auth, Cart, Theme) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Divider between Nav links and Auth */}
          <div className="hidden lg:block w-px h-6 bg-slate-400 dark:bg-slate-500" />

          {/* Cart Icon */}
          {isSignedIn && (
            <Link
              href="/warenkorb"
              className="relative p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Warenkorb"
            >
              <ShoppingCart className="w-5 h-5" />
              {clientTicketCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-pink-500 text-white text-[10px] font-extrabold px-1 rounded-full shadow-md animate-pulse">
                  {clientTicketCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth Buttons */}
          {!isSignedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-pink-500 transition-colors cursor-pointer">
                  Anmelden
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-pink-500 hover:opacity-90 rounded-full shadow-sm transition-all cursor-pointer">
                  Registrieren
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 bg-slate-50 dark:bg-[#141738] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-pink-500" />
                  <span>Profil</span>
                </button>
                <UserButton />
              </div>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-fadeIn">
                  <Link
                    href="/profil"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-pink-500" />
                    <span>Mein Profil</span>
                  </Link>

                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />

                  <SignOutButton redirectUrl="/">
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Abmelden</span>
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Menü öffnen"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white dark:bg-[#070818] border-b border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-6 space-y-6 animate-fadeIn max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Events suchen..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suppressHydrationWarning
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-3 text-base font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200"
            >
              Startseite
            </Link>

            <button
              onClick={() => handleScrollTo("events")}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Events entdecken
            </button>

            <button
              onClick={() => handleScrollTo("kategorien")}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Kategorien
            </button>

            <Link
              href="/event-erstellen"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200"
            >
              Event erstellen
            </Link>

            {isSignedIn && (
              <>
                <Link
                  href="/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>Mein Profil</span>
                  <User className="w-4 h-4 text-pink-500" />
                </Link>

                <Link
                  href="/warenkorb"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>Warenkorb</span>
                  {clientTicketCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {clientTicketCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Theme Toggle in Mobile */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Erscheinungsbild
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Auth in Mobile */}
          {!isSignedIn && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <SignInButton mode="modal">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Anmelden
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-500 text-white text-sm font-bold shadow-md cursor-pointer"
                >
                  Kostenlos registrieren
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
});

NavBar.displayName = "NavBar";

export default NavBar;
