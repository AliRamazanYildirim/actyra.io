'use client'

import { SlSocialFacebook } from "react-icons/sl";
import { LiaLinkedin } from "react-icons/lia";
import { FaXTwitter } from "react-icons/fa6";
import { PiMicrosoftTeamsLogo } from "react-icons/pi";
import Image from "next/image";

import Stars from "./DynamicStars";
export default function Footer() {
  const galleryImages = [
    "/images/event1.webp",
    "/images/event2.webp",
    "/images/event3.webp",
    "/images/event4.webp",
    "/images/event5.webp",
    "/images/event6.webp",
  ];
   

  return (
    <footer className="relative overflow-hidden bg-white dark:bg-[#0D0E25] text-black dark:text-white pt-10">
      {/* ✨ Stars */}
      <Stars />

      {/* Footer content */}
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
            <h3 className="font-semibold mb-4">
              QUICK LINKS 
            </h3>
            <ul className="space-y-2">
              {[
                "Privacy & policy",
                "Terms & conditions",
                "FAQ",
                "Customer support",
                "Contact us",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-pink-500 transition duration-200 cursor-pointer block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-center">
              SUBSCRIP NEWSLETTER 
            </h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded border border-gray-700 dark:border-gray-600 bg-white dark:bg-white text-black dark:text-black placeholder-black dark:placeholder-gray-600 mb-4"
            />

            <button className="w-full py-3 rounded bg-gradient-to-r text-white from-indigo-600 to-pink-500 font-bold hover:opacity-90 transition duration-200 cursor-pointer">
              SUBSCRIBE NOW
            </button>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="font-semibold mb-4 text-center">
              OUR GALLERY
            </h3>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {galleryImages.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square max-w-[65px] sm:max-w-[70px] md:max-w-[80px] w-full rounded-lg relative group overflow-hidden block"
                >
                  <Image
                    src={src}
                    alt={`gallery-${i}`}
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
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>Copyright © 2025 Actyra. All Rights Reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400 cursor-pointer">
              Privacy & Policy
            </a>
            <span className="hidden md:inline">||</span>
            <a href="#" className="hover:text-pink-400 cursor-pointer">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
