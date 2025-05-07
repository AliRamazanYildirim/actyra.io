// src/components/IntroSection.jsx

export default function IntroSection() {
    return (
      <section className=" bg-white dark:bg-[#0D0E25] text-black dark:text-white py-20 px-6 md:px-10 max-w-6xl mx-auto animate-fade-in-up">
        {/* Titel */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          Was ist {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Actyra?
          </span>
        </h2>
  
        {/* Einführungstext */}
        <p className="text-lg text-gray-800 mb-14 leading-relaxed">
          <strong>Actyra</strong> ist deine neue Plattform für {" "}
          <strong>soziale Erlebnisse</strong>. Von pulsierenden Clubnächten
          über entspannte Open-Air-Festivals bis hin zu gemütlichen Game-Nights
          – hier findest du Events, die Menschen zusammenbringen.
        </p>
  
        {/* Karten-Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[ 
            {
              title: "Für wen ist Actyra?",
              content: [
                "Partygänger, Kreative, Techies & Genießer",
                "Gruppen, Paare oder Solo-Entdecker",
                "Alle, die Lust auf echte Begegnungen haben",
              ],
            },
            {
              title: "Was macht unsere Events besonders?",
              content: [
                "Kuratierte Events mit Herz & Persönlichkeit",
                "Vielfalt: Von Yoga bis Tech, von Party bis Kunst",
                "Lokale Veranstalter & echte Community-Vibes",
              ],
            },
            {
              title: "So funktioniert Actyra",
              content: [
                "Finde dein Erlebnis",
                "Sichere dir deinen Platz",
                "Entdecke neue Leute & Städte",
              ],
            },
          ].map((card, index) => (
            <div
              key={index}
              className="card-animated group transition duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02] rounded-2xl p-6 bg-pink-100 border border-pink-200 text-gray-900 shadow-md hover:shadow-pink-300 animate-fade-in-up relative overflow-hidden"
            >
              <h3 className="text-xl font-bold text-pink-700 mb-4">
                {card.title}
              </h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                {card.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }
  