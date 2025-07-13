"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Euro,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Constants
const CATEGORIES = [
  { value: "kultur-musik", label: "🎵 Kultur & Musik" },
  { value: "sport-freizeit", label: "⚽ Sport & Freizeit" },
  { value: "bildung-workshop", label: "📚 Bildung & Workshop" },
  { value: "business-networking", label: "💼 Business & Networking" },
  { value: "gesundheit", label: "🧘‍♀️ Gesundheit" },
  { value: "technologie-innovation", label: "💻 Technologie & Innovation" },
  { value: "messen-ausstellungen", label: "🏢 Messen & Ausstellungen" },
  { value: "sonstige-events", label: "🎉 Sonstige Events" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "⏳ Ausstehend" },
  { value: "active", label: "✅ Aktiv" },
  { value: "completed", label: "🏁 Abgeschlossen" },
  { value: "cancelled", label: "❌ Abgesagt" },
];

const INITIAL_FORM_DATA = {
  title: "",
  location: "",
  date: "",
  price: 0,
  category: "",
  status: "active",
  shortDescription: "",
  longDescription: "",
  tags: "",
  image: null,
};

// Validation functions
const validateForm = (formData) => {
  const errors = {};

  if (!formData.title.trim()) errors.title = "Titel ist erforderlich";
  if (!formData.location.trim()) errors.location = "Ort ist erforderlich";
  if (!formData.date) errors.date = "Datum ist erforderlich";
  if (!formData.category) errors.category = "Kategorie ist erforderlich";
  if (formData.price < 0) errors.price = "Preis kann nicht negativ sein";

  return errors;
};

// Form data preparation
const prepareFormData = (formData) => {
  const submitData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "image" && value) {
      submitData.append("image", value);
    } else if (key === "tags") {
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      submitData.append("tags", JSON.stringify(tagsArray));
    } else if (key !== "image") {
      submitData.append(key, value);
    }
  });

  return submitData;
};

// Sub-components
const FormHeader = () => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <Link
        href="/admin/events"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Zurück
      </Link>
      <h1 className="text-3xl font-bold text-white">Neues Event erstellen</h1>
    </div>
  </div>
);

const BasicDataSection = ({ formData, errors, onChange }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <FileText className="w-5 h-5" />
      Grunddaten
    </h2>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Titel *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-text ${
            errors.title ? "border-red-500" : "border-gray-600"
          }`}
          placeholder="Event-Titel eingeben..."
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Ort *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-text ${
              errors.location ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Berlin, Hamburg..."
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Datum *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer ${
              errors.date ? "border-red-500" : "border-gray-600"
            }`}
          />
          {errors.date && (
            <p className="text-red-400 text-sm mt-1">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Euro className="w-4 h-4 inline mr-1" />
            Preis (€)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-text ${
              errors.price ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-400 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

const CategorySection = ({ formData, errors, onChange }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <Tag className="w-5 h-5" />
      Kategorisierung
    </h2>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Kategorie *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer ${
            errors.category ? "border-red-500" : "border-gray-600"
          }`}
        >
          <option value="">Kategorie wählen...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags (kommagetrennt)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-text"
          placeholder="Party, Berlin, Networking..."
        />
      </div>
    </div>
  </div>
);

const DescriptionSection = ({ formData, onChange }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-white mb-4">Beschreibungen</h2>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Kurzbeschreibung
        </label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-200 cursor-text"
          placeholder="Kurze Beschreibung des Events..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Detaillierte Beschreibung
        </label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={onChange}
          rows={6}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-200 cursor-text"
          placeholder="Detaillierte Beschreibung des Events..."
        />
      </div>
    </div>
  </div>
);

const ImageUploadSection = ({ imagePreview, onImageChange }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <ImageIcon className="w-5 h-5" />
      Event-Bild
    </h2>

    <div className="space-y-4">
      <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden relative">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p>Kein Bild ausgewählt</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg"
        >
          <Upload className="w-4 h-4" />
          Bild hochladen
        </label>
        <p className="text-gray-400 text-sm mt-2">
          JPG, PNG oder WebP • Max. 5MB
        </p>
      </div>
    </div>
  </div>
);

const ActionButtons = ({ isSubmitting, errors }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="space-y-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Wird erstellt...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Event erstellen
          </>
        )}
      </button>

      <Link
        href="/admin/events"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
      >
        Abbrechen
      </Link>
    </div>

    {errors.submit && (
      <div className="mt-4 p-4 bg-red-600/20 border border-red-600 rounded-lg">
        <p className="text-red-400 text-sm">{errors.submit}</p>
      </div>
    )}
  </div>
);

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = prepareFormData(formData);

      const response = await fetch("/api/admin/events", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/events");
      } else {
        setErrors({
          submit: result.error || "Event konnte nicht erstellt werden",
        });
      }
    } catch (error) {
      setErrors({ submit: "Ein Fehler ist aufgetreten" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0E25] rounded-xl p-6 pt-20 lg:pt-6">
      <div className="max-w-4xl mx-auto">
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Linke Spalte - Hauptdaten */}
            <div className="lg:col-span-2 space-y-6">
              <BasicDataSection
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              <CategorySection
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              <DescriptionSection
                formData={formData}
                onChange={handleInputChange}
              />
            </div>

            {/* Rechte Spalte - Bild & Actions */}
            <div className="space-y-6">
              <ImageUploadSection
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />

              <ActionButtons isSubmitting={isSubmitting} errors={errors} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
