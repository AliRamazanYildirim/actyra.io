'use client'

import { useState } from "react";
import { SlSocialFacebook } from "react-icons/sl";
import { LiaLinkedin } from "react-icons/lia";
import { FaXTwitter } from "react-icons/fa6";
import { PiMicrosoftTeamsLogo } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

import Stars from "./DynamicStars";

// ✅ Mini-Bilder mit jeweils eigener Event-URL
const galleryImages = [
  { src: "/images/event1.webp", href: "/events/neon-club-night" },   // Bild 1
  { src: "/images/event2.webp", href: "/events/open-air-festival" },   // Bild 2
  { src: "/images/event3.webp", href: "/events/tech-meetup" },    // Bild 3
  { src: "/images/event4.webp", href: "/events/yoga-im-park" },        // Bild 4
  { src: "/images/event5.webp", href: "/events/kunst-wein-abend" },    // Bild 5
  { src: "/images/event6.webp", href: "/events/game-night" }, // Bild 6
];

export default function Footer() {
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    setNewsletterSent(true);
    setTimeout(() => setNewsletterSent(false), 3000);
  };

  return (
    <footer className="relative overflow-hidden pt-10">
      <Stars />

      <div className="relative z-10">
        {/* Animated Logo Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4">
          <div className="animate-marquee gap-16">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <span key={i} className="text-white text-2xl font-bold px-8">
                  Actyra
                </span>
              ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 md:items-start md:text-left">
            <Image
              src="/logo-actyra.png"
              alt="Actyra Logo"
              width={100}
              height={100}
              priority
              className="w-24 h-24 object-contain transition-transform duration-500 hover:scale-110 hover:-translate-y-1 animate-pulseGlow"
            />
            <span className="text-3xl font-extrabold tracking-wide ">
              Actyra
            </span>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover, create and join amazing events with Actyra – your social
              event universe.
            </p>
            <div className="flex gap-4 mt-4">
              <SlSocialFacebook className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition text-white" />
              <FaXTwitter className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition text-white" />
              <PiMicrosoftTeamsLogo className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition text-white" />
              <LiaLinkedin className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition text-white" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/footer/privacy"
                  className="hover:text-pink-500 block"
                >
                  Privacy & Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/terms"
                  className="hover:text-pink-500 block"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/footer/faq" className="hover:text-pink-500 block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/support"
                  className="hover:text-pink-500 block"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/contact"
                  className="hover:text-pink-500 block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-center">
              Newsletter abonnieren
            </h3>
            <form onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                required
                className="w-full p-3 rounded border border-gray-700 dark:border-gray-600 bg-white dark:bg-white text-black dark:text-black placeholder-black dark:placeholder-gray-600 mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 rounded bg-gradient-to-r text-white from-indigo-600 to-pink-500 font-bold hover:opacity-90 transition"
              >
                Jetzt abonnieren
              </button>
              {newsletterSent && (
                <p className="text-green-500 text-sm mt-2 text-center">
                  Vielen Dank – <span className="italic">Coming Soon</span>
                </p>
              )}
            </form>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="font-semibold mb-4 text-center">OUR GALLERY</h3>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {galleryImages.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="aspect-square max-w-[65px] sm:max-w-[70px] md:max-w-[80px] w-full rounded-lg relative group overflow-hidden block"
                >
                  {/* Bild {i + 1} */}
                  <Image
                    src={item.src}
                    alt={`gallery-${i + 1}`}
                    width={80}
                    height={80}
                    priority
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-90 flex items-center justify-center transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 7l-10 10m0-10h10v10"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>Copyright © 2025 Actyra. All Rights Reserved</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <Link href="/footer/privacy" className="hover:text-pink-400">
              Privacy & Policy
            </Link>
            <span className="hidden md:inline">||</span>
            <Link href="/footer/terms" className="hover:text-pink-400">
              Terms & Conditions
            </Link>
            <span className="hidden md:inline">||</span>
            <Link href="/footer/faq" className="hover:text-pink-400">
              FAQ
            </Link>
            <span className="hidden md:inline">||</span>
            <Link href="/footer/support" className="hover:text-pink-400">
              Support
            </Link>
            <span className="hidden md:inline">||</span>
            <Link href="/footer/contact" className="hover:text-pink-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
