import React from "react";
import Image from "next/image";

export default function SupportComp() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 pt-24 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-10 text-center">Customer Support</h1>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Bild */}
        <div className="w-full md:w-1/2">
          <Image
            src="/support.png"
            alt="Support Mitarbeiter"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl w-full h-auto"
            priority
          />
        </div>

        {/* Kontaktdaten */}
        <div className="w-full md:w-1/2 text-lg space-y-4">
          <p>
            Unser freundliches Support-Team hilft dir gerne bei allen Fragen und Anliegen rund um Actyra.
          </p>
          <div>
            <p className="font-semibold">E-Mail:</p>
            <p className="text-pink-600 dark:text-pink-400">support@actyra.de</p>
          </div>
          <div>
            <p className="font-semibold">Telefon:</p>
            <p className="text-pink-600 dark:text-pink-400">+49 69 555 555</p>
          </div>
        </div>
      </div>
    </section>
  );
}
