"use client";
import React, { useState } from "react";

export default function ContactComp() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 pt-24 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-10 text-center">Kontaktiere uns</h1>

      {/* Formular */}
      <div className="w-full md:w-3/4 mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Dein Name</label>
            <input
              type="text"
              required
              placeholder="Max Mustermann"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-200 text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Projekt / Firma</label>
            <input
              type="text"
              required
              defaultValue="Actyra"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-200 text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Telefonnummer</label>
            <input
              type="tel"
              required
              placeholder="+49 69 123456"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-200 text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">E-Mail-Adresse</label>
            <input
              type="email"
              required
              placeholder="kontakt@actyra.de"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-200 text-black"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Absenden
          </button>
        </form>

        {submitted && (
          <div className="text-green-500 font-semibold mt-4">
            Vielen Dank – <span className="italic">Coming Soon</span>
          </div>
        )}
      </div>

      {/* Google Maps Embed */}
      <div className="mt-16 w-full">
        <div className="rounded-2xl overflow-hidden shadow-xl w-full h-[400px]">
          <iframe
            title="Standort Frankfurt"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.029770043073!2d8.68090357688205!3d50.11092267152552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bcd60b99eae0e3%3A0x2cc3c65085b8e776!2sR%C3%B6mer%2C%2060311%20Frankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1715670000000!5m2!1sde!2sde"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
