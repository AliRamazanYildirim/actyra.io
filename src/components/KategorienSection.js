// src/components/KategorienSection.js
// Scriptverantwortlicher: ASE
"use client";

import Link from 'next/link';

import KategorieKulturMusik from '@/icons/KategorieKulturMusik';
import KategorieSportFreizeit from '@/icons/KategorieSportFreizeit';
import KategorieBildungWorkshop from '@/icons/KategorieBildungWorkshop';
import KategorieBusinessNetworking from '@/icons/KategorieBusinessNetworking';
import KategorieGesundheit from '@/icons/KategorieGesundheit';
import KategorieTechnologieInnovation from '@/icons/KategorieTechnologieInnovation';
import KategorieMessenAusstellungen from '@/icons/KategorieMessenAusstellungen';
import KategorieSonstigeEvents from '@/icons/KategorieSonstigeEvents';

const kategorien = [
  { slug: 'kultur-musik', icon: KategorieKulturMusik, name: 'Kultur & Musik' },
  { slug: 'sport-freizeit', icon: KategorieSportFreizeit, name: 'Sport & Freizeit' },
  { slug: 'bildung-workshop', icon: KategorieBildungWorkshop, name: 'Bildung & Workshop' },
  { slug: 'business-networking', icon: KategorieBusinessNetworking, name: 'Business & Networking' },
  { slug: 'gesundheit', icon: KategorieGesundheit, name: 'Gesundheit' },
  { slug: 'technologie-innovation', icon: KategorieTechnologieInnovation, name: 'Technologie & Innovation' },
  { slug: 'messen-ausstellungen', icon: KategorieMessenAusstellungen, name: 'Messen & Ausstellungen' },
  { slug: 'sonstige-events', icon: KategorieSonstigeEvents, name: 'Sonstige Events' },
];

const handleScrollTo = (id) => {
  setIsMobileMenuOpen(false);
  if (pathname !== "/") {
    router.push(`/#${id}`);
  } else {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  }
};

export default function KategorienSection() {
  return (
<section id="kategorien" className="scroll-mt-24 dark-light-mode">
  <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
    
    {/* H2 mit Farbverlauf */}
    <h2 className="text-4xl font-extrabold mb-4 text-left">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        Kategorien
      </span>
    </h2>
    
    {/* Untertitel, nur "Events nach Kategorien" mit Verlauf */}
    <p className="mb-10 text-lg leading-relaxed text-left">
      Entdecke{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        Events nach Kategorien
      </span>{" "}
      – finde dein Highlight und unterstütze dabei gute Zwecke.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {kategorien.map((kategorie, index) => {
        const IconComponent = kategorie.icon;
        return (
          <Link
            key={index}
            href={`/kategorien/${kategorie.slug}`}
            className="group bg-white rounded-2xl shadow-lg transform transition hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 p-6 flex flex-col items-center"
          >
            <IconComponent className="w-20 h-20 mb-4 text-[#613583] group-hover:text-white" />
            <p className="text-center text-base font-semibold text-[#1c1f3c] group-hover:text-white">
              {kategorie.name}
            </p>
          </Link>
        );
      })}
    </div>

  </div>
</section>

  );
}
