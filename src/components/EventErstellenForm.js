"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import categories from "../data/categories";
import ImageUpload from "./ImageUpload";
import EventPreview from "./EventPreview";

const EventErstellenForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    date: "",
    tickets: "",
    price: "",
    donation: "",
    image: null,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Funktion zum Verarbeiten von Eingabeänderungen
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funktion zum Hochladen von Bildern
  const handleImageUpload = (imageFile) => {
    setFormData((prev) => ({
      ...prev,
      image: imageFile,
    }));
  };

  // Funktion zum Anzeigen der Vorschau
  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  // Funktion zum Zurückkehren von der Vorschau
  const handleBack = () => {
    setShowPreview(false);
  };

  // Funktion zum Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      // FormData erstellen
      const data = new FormData();

      // Werte zu FormData hinzufügen und mit console.log überprüfen
      for (const key in formData) {
        if (key === "image" && formData[key]) {
          console.log("Bild wird hinzugefügt:", formData[key].name);
          data.append("image", formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }

      console.log("Formular wird gesendet...");

      // An API senden
      const response = await fetch("/api/events", {
        method: "POST",
        body: data, // Content-Type-Header nicht angeben, wird automatisch hinzugefügt
      });

      const result = await response.json();

      if (response.ok) {
        alert("Event wurde erfolgreich erstellt!");
        router.push(`/events/${result.event.slug}`); // Weiterleitung zum erstellten Event
      } else {
        setError(result.error || "Ein Problem ist aufgetreten");
        alert(`Fehler: ${result.error || "Ein Problem ist aufgetreten"}`);
      }
    } catch (error) {
      console.error("Fehler beim Senden des Formulars:", error);
      setError("Beim Speichern des Events ist ein Fehler aufgetreten.");
      alert("Beim Speichern des Events ist ein Fehler aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <main className="">
      {/* Hero-Bereich neu eingebunden */}

      {/* Formular-Bereich */}
      <section className="py-5 ">
        <div className="event-background rounded-xl shadow-lg max-w-5xl mx-auto p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4 flex items-center shadow-sm">
              <div className="flex-shrink-0 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handlePreview} className="space-y-6">
            {/* Titel */}
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text text-center">
              🎟️ Tragen Sie hier Ihr Event ein!
            </h1>
            <div>
              <label className="block font-semibold mb-1 text-white">
                Titel
              </label>
              <input
                type="text"
                name="title"
                placeholder="Hier können Sie den Titel Ihres Events eingeben..."
                value={formData.title}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Beschreibung
              </label>
              <textarea
                name="description"
                placeholder="Hier können Sie Ihr Event beschreiben..."
                value={formData.description}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Ort */}
            <div>
              <label className="block font-semibold mb-1 text-white">Ort</label>
              <input
                type="text"
                name="location"
                placeholder="Hier können Sie den Ort Ihres Events eingeben..."
                value={formData.location}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Kategorie */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Kategorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="ticket-input text-black dark:text-white placeholder-black dark:placeholder-white"
                required
              >
                <option value="" className="text-black">
                  Bitte wählen
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Datum */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Datum
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="ticket-input"
                required
              />
            </div>

            {/* Ticketanzahl */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Ticketanzahl
              </label>
              <input
                type="number"
                name="tickets"
                placeholder="Hier können Sie die Ticketanzahl eingeben..."
                value={formData.tickets}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Preis */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Preis (€)
              </label>
              <input
                type="number"
                name="price"
                placeholder="Hier können Sie den Preis eingeben..."
                value={formData.price}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Spendenbetrag */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Spendenbetrag (€)
              </label>
              <input
                type="number"
                name="donation"
                placeholder="Hier können Sie den Spendenbetrag eingeben..."
                value={formData.donation}
                onChange={handleChange}
                className="ticket-input placeholder:text-black"
                required
              />
            </div>

            {/* Bild-Upload */}
            <div>
              <label className="block font-semibold mb-1 text-white">
                Eventbild/Flyer
              </label>
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            {/* Vorschau-Button */}
            <div className="flex justify-center">
              <button type="submit" className="ticket-button cursor-pointer">
                Vorschau anzeigen
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EventErstellenForm;
