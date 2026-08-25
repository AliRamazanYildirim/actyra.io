"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ContactComp() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Support & Anfragen</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Kontaktiere das{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Actyra Team
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Hast du Fragen zu Tickets, möchtest dein Event listen oder eine
          Partnerschaft anfragen? Wir sind für dich da.
        </p>
      </div>

      {/* Grid: Form (Left) & Contact Info + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dein Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Max Mustermann"
                  suppressHydrationWarning
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  required
                  placeholder="kontakt@actyra.de"
                  suppressHydrationWarning
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  placeholder="+49 69 123456"
                  suppressHydrationWarning
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Projekt / Organisation
                </label>
                <input
                  type="text"
                  placeholder="z.B. Kulturverein e.V."
                  suppressHydrationWarning
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Deine Nachricht *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Wie können wir dir weiterhelfen?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Nachricht absenden</span>
            </button>
          </form>

          {submitted && (
            <div className="flex items-center gap-2 text-sm text-emerald-500 font-semibold p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Vielen Dank! Deine Nachricht wurde erfolgreich übermittelt.
              </span>
            </div>
          )}
        </div>

        {/* Right Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Direkter Kontakt
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@actyra.io</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Römer, 60311 Frankfurt am Main</span>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 h-64 w-full">
            <iframe
              title="Standort Frankfurt"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.029770043073!2d8.68090357688205!3d50.11092267152552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bcd60b99eae0e3%3A0x2cc3c65085b8e776!2sR%C3%B6mer%2C%2060311%20Frankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1715670000000!5m2!1sde!2sde"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
