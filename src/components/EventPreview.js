"use client";

import Image from "next/image";
import {
  MapPin,
  Calendar,
  Euro,
  HeartHandshake,
  ArrowLeft,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";

const EventPreview = ({ formData, onBack, onSubmit, isSubmitting }) => {
  const getImageSrc = () => {
    if (!formData.image) return null;
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    return formData.image;
  };

  const imageSrc = getImageSrc();
  const ticketPrice = parseFloat(formData.price) || 0;
  const donationAmount = parseFloat(formData.donation) || 0;

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Notification Bar */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Vorschau-Modus
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                So wird dein Event für Interessenten und Ticketkäufer
                dargestellt.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Bearbeiten
          </button>
        </div>

        {/* Main Event Showcase Card */}
        <div className="bg-white dark:bg-[#0d0f26] border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Media Banner */}
          <div className="relative w-full h-72 sm:h-96 bg-slate-900">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={formData.title || "Event Bild"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white p-6 text-center">
                <Layers className="w-12 h-12 mb-2 opacity-60" />
                <span className="text-lg font-bold">
                  Kein Titelbild hochgeladen
                </span>
                <span className="text-xs text-white/70">
                  Es wird ein Standard-Hintergrund verwendet
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Over-image Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex flex-wrap items-center gap-2">
                {formData.category && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-600 text-white shadow-md">
                    {formData.category.replace("-", " & ").toUpperCase()}
                  </span>
                )}
                {donationAmount > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
                    {donationAmount} € Spendenbeitrag
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Event Content Details */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Title & Key Specs */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
                {formData.title || "Event-Titel"}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141738]/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Datum
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("de-DE", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Datum nicht gewählt"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141738]/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Ort
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate block">
                      {formData.location || "Veranstaltungsort"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141738]/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Euro className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Ticketpreis
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {ticketPrice === 0 ? "Kostenlos" : `${ticketPrice} €`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Über diese Veranstaltung
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {formData.description || "Keine Beschreibung angegeben."}
              </p>
            </div>

            {/* Impact Calculation Preview */}
            {donationAmount > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 text-slate-800 dark:text-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-pink-600 dark:text-pink-400">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Verifizierter Spendenbeitrag</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Von jedem Ticketpreis fließen{" "}
                  <strong>{donationAmount} €</strong> direkt an geförderte
                  Partnerprojekte. Nach dem Event erhältst du als Veranstalter
                  einen offiziellen Spendenbeleg.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#1a1e4a] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück zum Bearbeiten</span>
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Event wird gespeichert...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Event jetzt veröffentlichen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventPreview;
