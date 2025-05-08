// Scriptverantwortlicher : ASE
"use client"; // Client-Komponente

import { useState } from "react";
import categories from "../data/categories";
import ImageUpload from "./ImageUpload";
import EventPreview from "./EventPreview";

const EventForm = () => {
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
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gespeichertes Event:", formData);
    alert("Event gespeichert (Simulation)");
  };

  if (showPreview) {
    return (
      <EventPreview
        formData={formData}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <main className="">
      {/* Hero Bereich neu eingebunden */}

      {/* Formular Bereich */}
      <section className="py-5 ">
        <div className="event-background rounded-xl shadow-lg max-w-5xl mx-auto p-8">
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
                className="ticket-input placeholder:text-gray-600"
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
                className="ticket-input placeholder:text-gray-600"
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
                className="ticket-input placeholder:text-gray-600"
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
                className="ticket-input placeholder:text-gray-600"
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
                className="ticket-input placeholder:text-gray-600"
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
                className="ticket-input placeholder:text-gray-600"
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

export default EventForm;
