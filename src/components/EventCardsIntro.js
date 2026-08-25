"use client";

import { Users2, HeartHandshake, Compass, CheckCircle2 } from "lucide-react";

export default function EventCardsIntro() {
  const cards = [
    {
      icon: Users2,
      color: "from-blue-500 to-indigo-600",
      title: "Für wen ist Actyra?",
      items: [
        "Partygänger, Kreative, Techies & Genießer",
        "Gruppen, Paare oder Solo-Entdecker",
        "Alle, die Lust auf echte Begegnungen haben",
      ],
    },
    {
      icon: HeartHandshake,
      color: "from-purple-500 to-pink-500",
      title: "Was macht uns besonders?",
      items: [
        "Kuratierte Events mit Herz & Persönlichkeit",
        "Automatische Spende bei jedem Ticketkauf",
        "Lokale Veranstalter & echte Community-Vibes",
      ],
    },
    {
      icon: Compass,
      color: "from-pink-500 to-rose-600",
      title: "So einfach funktioniert's",
      items: [
        "Finde dein passendes Erlebnis in deiner Stadt",
        "Sichere dir in Sekunden deinen Platz",
        "Erlebe unvergessliche Momente & tue Gutes",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mb-14 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Was ist{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Actyra?
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Actyra</strong> ist deine Plattform für{" "}
          <strong>soziale Erlebnisse</strong>. Von pulsierenden Clubnächten über
          entspannte Open-Air-Festivals bis hin zu inspirierenden Workshops –
          hier verbinden wir Entertainment mit sozialem Impact.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="flex flex-col justify-between p-8 premium-card"
            >
              <div className="space-y-6">
                {/* Icon Badge */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md shadow-pink-500/10`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {card.title}
                </h3>

                {/* Bullet List */}
                <ul className="space-y-3">
                  {card.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-snug"
                    >
                      <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
