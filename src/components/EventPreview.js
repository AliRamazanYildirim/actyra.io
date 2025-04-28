"use client"; // Client-Komponente wegen Button-Events

// src/components/EventPreview.js
// Eventvorschau exakt wie Live-Eventkarte mit Weißraum

const EventPreview = ({ formData, onBack, onSubmit }) => {
  return (
    <main className="min-h-screen bg-white pt-10 pb-10">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-[#12192f] rounded-xl overflow-hidden shadow-xl text-white">
          {formData.image && (
            <img
              src={formData.image}
              alt="Event Bild"
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2 text-[#c127d9]">{formData.title}</h2>

            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              <span>📅 {formData.date}</span>
              <span>📍 {formData.location}</span>
              <span>💶 {formData.price} €</span>
            </div>

            <p className="text-gray-300 mb-4">{formData.description}</p>

            <hr className="border-pink-500 my-4" />

            <div className="text-gray-400 text-sm mb-6">
              <p>Kategorie: {formData.category}</p>
              <p>Verfügbare Tickets: {formData.tickets}</p>
              <p>Spendenbetrag: {formData.donation} €</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Zurück bearbeiten
              </button>
              <button
                onClick={onSubmit}
                className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Event speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventPreview;
