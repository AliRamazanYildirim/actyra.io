"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import categories from "../data/categories";
import ImageUpload from "./ImageUpload";
import EventPreview from "./EventPreview";
import {
  CalendarPlus,
  AlertCircle,
  Eye,
  Sparkles,
  MapPin,
  Calendar,
  Euro,
  HeartHandshake,
  Layers,
  FileText,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";

const EventErstellenForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    date: "",
    price: "",
    donation: "",
    image: null,
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCategory = (catName) => {
    setFormData((prev) => ({
      ...prev,
      category: catName,
    }));
    setIsCategoryOpen(false);
  };

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageFile) => {
    setFormData((prev) => ({
      ...prev,
      image: imageFile,
    }));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.date) {
      setError("Bitte fülle alle Pflichtfelder (Titel, Ort, Datum) aus.");
      return;
    }
    setError("");
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const data = new FormData();
      for (const key in formData) {
        if (key === "image" && formData[key]) {
          data.append("image", formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/events/${result.event.slug}`);
      } else {
        setError(result.error || "Ein Problem ist aufgetreten.");
      }
    } catch (err) {
      console.error("Fehler beim Senden des Formulars:", err);
      setError("Beim Speichern des Events ist ein Fehler aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImageSrc = formData.image
    ? formData.image instanceof File
      ? URL.createObjectURL(formData.image)
      : formData.image
    : null;

  const donationAmount = parseFloat(formData.donation) || 0;
  const ticketPrice = parseFloat(formData.price) || 0;

  if (showPreview) {
    return (
      <EventPreview
        formData={formData}
        onBack={handleBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Neues Event veröffentlichen
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Fülle die Event-Details aus. In der Live-Vorschau siehst du direkt,
          wie deine Veranstaltung für Besucher dargestellt wird.
        </p>
      </div>

      {error && (
        <div className="mb-8 max-w-4xl mx-auto p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Hinweis zur Event-Erstellung</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 2-Column Creator Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Form Area (Span 7) */}
        <form onSubmit={handlePreview} className="lg:col-span-7 space-y-8">
          {/* Section 1: Grunddaten */}
          <div className="relative z-30 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d0f26]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Grundlegende Informationen
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Titel, Themenbereich und Beschreibung
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Event-Titel *
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {formData.title.length}/100 Zeichen
                </span>
              </label>
              <input
                type="text"
                name="title"
                maxLength={100}
                placeholder="z.B. Neon Charity Night 2026"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm font-medium"
                required
              />
            </div>

            {/* Category Custom Dropdown */}
            <div ref={categoryRef} className="relative z-40">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <Layers className="w-4 h-4 text-purple-500" />
                Kategorie *
              </label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`w-full px-4 py-3 rounded-2xl border text-left flex items-center justify-between transition-all text-sm font-medium cursor-pointer ${
                  isCategoryOpen
                    ? "border-pink-500 ring-2 ring-pink-500/20 bg-white dark:bg-[#141738]"
                    : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] hover:border-slate-300 dark:hover:border-slate-600"
                } text-slate-900 dark:text-white`}
              >
                <span
                  className={
                    formData.category
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-400 dark:text-slate-400"
                  }
                >
                  {formData.category
                    ? formData.category.replace("-", " & ").toUpperCase()
                    : "Kategorie auswählen..."}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180 text-pink-500" : ""
                  }`}
                />
              </button>

              {/* Custom Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/70 p-2 space-y-1 backdrop-blur-2xl">
                  {categories.map((cat) => {
                    const isSelected = formData.category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleSelectCategory(cat.name)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141738] hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected
                                ? "bg-pink-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                          {cat.name.replace("-", " & ").toUpperCase()}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-pink-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Beschreibung *
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Beschreibe dein Event, das Line-up, den Ablauf und für welche Initiative gespendet wird..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 2: Ort & Datum */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d0f26]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Zeitpunkt & Veranstaltungsort
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Wann und wo findet dein Event statt?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Location */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  Veranstaltungsort *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="z.B. Tanzhaus West, Frankfurt"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm font-medium"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Datum *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={handleChange}
                    onClick={(e) => {
                      try {
                        e.target.showPicker && e.target.showPicker();
                      } catch {}
                    }}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm font-medium cursor-pointer scheme-light dark:scheme-dark date-input"
                    required
                  />
                  <div
                    onClick={(e) => {
                      const input =
                        e.currentTarget.parentElement?.querySelector(
                          'input[type="date"]',
                        );
                      if (input) {
                        try {
                          input.showPicker && input.showPicker();
                        } catch {}
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400 transition-colors cursor-pointer pointer-events-auto"
                  >
                    <Calendar className="w-5 h-5 text-purple-500 hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tickets & Spendenanteil */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d0f26]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ticketing & Social Impact
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Preise festlegen und Spendenbeitrag definieren
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <Euro className="w-4 h-4 text-emerald-500" />
                  Ticketpreis (€) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    name="price"
                    placeholder="0 für kostenlos"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm font-medium"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    €
                  </span>
                </div>
              </div>

              {/* Donation */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <HeartHandshake className="w-4 h-4 text-pink-500" />
                  Spendenanteil pro Ticket (€) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    name="donation"
                    placeholder="z.B. 2"
                    value={formData.donation}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm font-medium"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-pink-500">
                    €
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Impact Calculator Banner */}
            {donationAmount > 0 && (
              <div className="p-4 rounded-2xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-500 text-white shrink-0 shadow-sm">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Dein geplanter Social Impact:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Bei 100 verkauften Tickets werden automatisch{" "}
                    <strong className="text-pink-600 dark:text-pink-400">
                      {(100 * donationAmount).toFixed(2)} €
                    </strong>{" "}
                    an gemeinnützige Organisationen gespendet!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Flyer / Image Upload */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d0f26]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Event-Flyer & Titelbild
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lade ein ansprechendes Titelbild für dein Event hoch
                </p>
              </div>
            </div>

            <ImageUpload onImageUpload={handleImageUpload} />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5" />
              <span>Event überprüfen & Vorschau öffnen</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Sticky Card Preview (Span 5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Live Card Preview</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Echtzeit-Ansicht
            </span>
          </div>

          {/* Simulated Actyra Card */}
          <div className="premium-card overflow-hidden">
            {/* Image Banner */}
            <div className="relative w-full h-48 sm:h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {previewImageSrc ? (
                <Image
                  src={previewImageSrc}
                  alt="Live Vorschau"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-700/60 flex items-center justify-center text-slate-400">
                    <CalendarPlus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium">
                    Titelbild wird hier angezeigt
                  </span>
                </div>
              )}

              {/* Category Pill Tag */}
              {formData.category && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md text-slate-900 dark:text-white shadow-md border border-slate-200/50 dark:border-white/10">
                  {formData.category.replace("-", " & ").toUpperCase()}
                </span>
              )}

              {/* Donation Badge */}
              {donationAmount > 0 && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-500 text-white shadow-lg shadow-pink-500/30 flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  {donationAmount} € Spende
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 min-h-7">
                {formData.title || "Dein Event-Titel..."}
              </h4>

              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                  <span className="truncate">
                    {formData.location || "Veranstaltungsort..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("de-DE", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Datum wählen..."}
                  </span>
                </div>
              </div>

              {formData.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {formData.description}
                </p>
              )}

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    Ticketpreis
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {ticketPrice === 0 ? "Kostenlos" : `${ticketPrice} €`}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-500/10 border border-pink-500/20">
                  <span>Tickets buchen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-pink-500 shrink-0" />
            <span>
              Veranstalter-Garantie: Direkte Auszahlung nach Event-Abschluss &
              100% Spendenbeleg.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventErstellenForm;
