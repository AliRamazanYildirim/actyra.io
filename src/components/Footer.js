"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  Heart,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa6";
import DynamicStars from "./DynamicStars";

const galleryImages = [
  { src: "/images/event1.webp", href: "/events/neon-club-night" },
  { src: "/images/event2.webp", href: "/events/open-air-festival" },
  { src: "/images/event3.webp", href: "/events/tech-meetup" },
  { src: "/images/event4.webp", href: "/events/yoga-im-park" },
  { src: "/images/event5.webp", href: "/events/kunst-wein-abend" },
  { src: "/images/event6.webp", href: "/events/game-night" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterSent(false);
      setEmail("");
    }, 4000);
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200 pt-16 pb-8 border-t border-slate-800/80">
      <DynamicStars />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo-actyra.png"
                  alt="Actyra Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Actyra
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Deine Plattform für soziale Erlebnisse. Finde unvergessliche
              Events, lerne neue Menschen kennen und spende mit jedem Ticket
              automatisch für den guten Zweck.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  icon: FaInstagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                },
                {
                  icon: FaXTwitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  icon: FaLinkedinIn,
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                },
                {
                  icon: FaFacebookF,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400 text-slate-400 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Navigation</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-pink-400 transition-colors"
                >
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-pink-400 transition-colors"
                >
                  Alle Events
                </Link>
              </li>
              <li>
                <Link
                  href="/event-erstellen"
                  className="hover:text-pink-400 transition-colors"
                >
                  Event erstellen
                </Link>
              </li>
              <li>
                <Link
                  href="/profil"
                  className="hover:text-pink-400 transition-colors"
                >
                  Mein Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              Rechtliches & Hilfe
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/footer/privacy"
                  className="hover:text-pink-400 transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/terms"
                  className="hover:text-pink-400 transition-colors"
                >
                  AGB & Bedingungen
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/faq"
                  className="hover:text-pink-400 transition-colors"
                >
                  Häufige Fragen (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/support"
                  className="hover:text-pink-400 transition-colors"
                >
                  Kundenservice
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/contact"
                  className="hover:text-pink-400 transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              Newsletter
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Erhalte exklusive Event-Highlights und Community-Updates direkt in
              dein Postfach.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  suppressHydrationWarning
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-rrom-purple-600 to-pink-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/20 cursor-pointer"
              >
                <span>Abonnieren</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              {newsletterSent && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Vielen Dank! Du bist angemeldet.</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Gallery Thumbnails Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Event-Momente
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {galleryImages.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-800 hover:border-pink-500/80 transition-all duration-200 group"
              >
                <Image
                  src={item.src}
                  alt={`Event ${i + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Mission */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Actyra. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-1">
            Mit{" "}
            <Heart className="w-3.5 h-3.5 text-pink-500 inline fill-pink-500" />{" "}
            gebaut für soziale Wirkung.
          </p>
        </div>
      </div>
    </footer>
  );
}
