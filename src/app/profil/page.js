"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  CheckCircle,
  ChevronRight,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  RefreshCw as RefreshCwIcon,
  Upload as UploadIcon,
  X as XIcon,
} from "lucide-react";
import Link from "next/link";
import useTicketStore from "@/store/ticketStore";
import EventList from "@/components/EventList";
import eventSeedData from "@/data/eventSeedData.js";

export default function ProfilPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Ticket store hooks
  const tickets = useTicketStore((state) => state.purchasedTickets);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const isLoading = useTicketStore((state) => state.isLoading);
  const error = useTicketStore((state) => state.error);
  const clearError = useTicketStore((state) => state.clearError);

  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("profil");
  const [imageError, setImageError] = useState(false);

  // Beispieldaten - später durch echte Daten ersetzen
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Passwort-Änderung
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Benutzerprofileinstellungen und Beispieldaten laden
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setImage(user.imageUrl || "");
      setImageError(false);
      setUploadedImage(null);

      // Verwende die echten Event-Daten aus events.js
      if (eventSeedData && eventSeedData.length > 0) {
        // Die ersten zwei Events als "besuchte Events" verwenden
        setAttendedEvents([
          {
            ...eventSeedData[0],
            id: eventSeedData[0].slug,
            date: new Date(eventSeedData[0].date).toLocaleDateString("de-DE"),
          },
          {
            ...eventSeedData[1],
            id: eventSeedData[1].slug,
            date: new Date(eventSeedData[1].date).toLocaleDateString("de-DE"),
          },
        ]);

        // Die nächsten zwei Events als "kommende Events" verwenden
        setUpcomingEvents([
          {
            ...eventSeedData[2],
            id: eventSeedData[2].slug,
            date: new Date(eventSeedData[2].date).toLocaleDateString("de-DE"),
          },
          {
            ...eventSeedData[3],
            id: eventSeedData[3].slug,
            date: new Date(eventSeedData[3].date).toLocaleDateString("de-DE"),
          },
        ]);
      }

      // Tickets beim Laden der Seite abrufen
      fetchTickets();
    }
  }, [user, fetchTickets]);

  // Tickets bei jedem Wechsel zum Tickets-Tab neu laden
  useEffect(() => {
    if (activeTab === "tickets" && user) {
      fetchTickets();
    }

    if (activeTab !== "tickets") {
      clearError();
    }
  }, [activeTab, user, fetchTickets, clearError]);

  useEffect(() => {
    if (image) {
      setImageError(false);
    }
  }, [image]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-500">
        Profil wird geladen...
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  // Bild-Upload-Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Bitte wählen Sie eine Datei unter 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (upload) => {
      setUploadedImage(upload.target.result);
      setImage(""); // URL-Eingabe zurücksetzen, da wir jetzt ein hochgeladenes Bild verwenden
    };

    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    // Wenn wir ein hochgeladenes Bild haben, verwenden wir dieses
    const finalImage = uploadedImage || image;

    // URL-Validierung nur prüfen, wenn wir eine URL und kein hochgeladenes Bild verwenden
    if (!uploadedImage && image && !image.startsWith("http")) {
      alert("Bitte geben Sie eine gültige Bild-URL ein.");
      return;
    }

    alert(
      `Name: ${name}\nBild wurde aktualisiert\nProfil aktualisiert (nur Demo)`
    );
    setEditing(false);
  };

  // Passwort-Änderung
  const handlePasswordChange = () => {
    // Passwortüberprüfung und Kontrollen
    if (newPassword.length < 8) {
      setPasswordError("Das Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Die Passwörter stimmen nicht überein");
      return;
    }

    // Für die Demo ein Alert, in der echten Anwendung sollte es mit der Clerk-API integriert werden.
    alert("Passwort wurde aktualisiert (nur Demo)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handlePasswordReset = () => {
    // Für die Demo ein Alert, in der echten Anwendung sollte es mit der Clerk-API integriert werden.
    alert(
      `Ein Link zum Zurücksetzen des Passworts wurde an ${user.emailAddresses[0].emailAddress} gesendet (nur Demo)`
    );
  };

  // Tickets als Events formatieren - mit Daten aus events.js anreichern
  const ticketsAsEvents = Array.isArray(tickets)
    ? tickets.map((ticket) => {
        // Finde das passende Event aus den eventSeedData basierend auf slug
        const matchingEvent =
          eventSeedData.find((event) => event.slug === ticket.slug) || {};

        return {
          id: ticket._id || ticket.slug, // MongoDB ID verwenden, wenn vorhanden
          slug: ticket.slug,
          title: ticket.eventTitle,
          location: ticket.location,
          date: ticket.date,
          imageUrl:
            ticket.imageUrl ||
            matchingEvent.imageUrl ||
            "/images/event-default.webp",
          price: ticket.totalPrice,
          pricePerTicket: ticket.price,
          tags: [
            "Ticket",
            `${ticket.quantity}x`,
            ticket.orderNumber ? `#${ticket.orderNumber.substring(0, 6)}` : "",
          ],
        };
      })
    : [];

  // Bestimmen, welches Bild angezeigt wird
  const displayImage = uploadedImage || image;

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-24 space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Mein Actyra Profil
        </h1>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab("profil")}
            className={`px-4 py-2 mx-2 font-medium rounded-t-lg transition cursor-pointer ${
              activeTab === "profil"
                ? "bg-pink-600 text-white"
                : "text-gray-900 hover:bg-[#0f172a] hover:text-white dark:text-gray-500 dark:hover:bg-white dark:hover:text-gray-900"
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-2 mx-2 font-medium rounded-t-lg transition cursor-pointer ${
              activeTab === "tickets"
                ? "bg-pink-600 text-white"
                : "text-gray-900 hover:bg-[#0f172a] hover:text-white dark:text-gray-500 dark:hover:bg-white dark:hover:text-gray-900"
            }`}
          >
            Meine Tickets
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 mx-2 font-medium rounded-t-lg transition cursor-pointer ${
              activeTab === "history"
                ? "bg-pink-600 text-white"
                : "text-gray-900 hover:bg-[#0f172a] hover:text-white dark:text-gray-500 dark:hover:bg-white dark:hover:text-gray-900"
            }`}
          >
            Besuchte Events
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 mx-2 font-medium rounded-t-lg transition cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-pink-600 text-white"
                : "text-gray-900 hover:bg-[#0f172a] hover:text-white dark:text-gray-500 dark:hover:bg-white dark:hover:text-gray-900"
            }`}
          >
            Kommende Events
          </button>
        </div>

        {/* Profil-Tab */}
        {activeTab === "profil" && (
          <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full border-4 border-pink-500 shadow-md overflow-hidden relative">
                {displayImage && !imageError ? (
                  <Image
                    src={displayImage}
                    alt={name || "Profilbild"}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Image
                    src="/default-avatar.png"
                    alt="Standard-Profilbild"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {name || "Name nicht angegeben"}
                </h2>
                <p className="text-gray-100 mb-2">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>

            {editing && (
              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>

                {/* Profilbild-Upload-Bereich */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Profilbild
                  </label>

                  {/* Datei-Upload */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 bg-gray-700/30 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadIcon className="w-4 h-4" />
                        Bild hochladen
                      </Button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      {uploadedImage && (
                        <span className="text-sm text-green-400 flex items-center gap-1">
                          Bild hochgeladen
                          <button
                            onClick={clearUploadedImage}
                            className="ml-1 p-1 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-200 mt-1">
                      Maximale Dateigröße: 5MB
                    </p>
                  </div>

                  {/* URL-Eingabe */}
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label
                        htmlFor="image"
                        className="block text-xs font-medium mb-1"
                      >
                        Oder verwende eine Bild-URL:
                      </label>
                      <input
                        id="image"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        disabled={!!uploadedImage}
                      />
                    </div>

                    {/* Bild-Vorschau */}
                    <div className="h-14 w-14 rounded-full overflow-hidden relative border-2 border-pink-500">
                      {displayImage && !imageError ? (
                        <Image
                          src={displayImage}
                          alt="Vorschau"
                          fill
                          className="object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                          Vorschau
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Abschnitt zum Ändern des Passworts */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <LockIcon className="w-5 h-5 mr-2 text-pink-500" />
                    Passwort ändern
                  </h3>

                  <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg">
                    {/* Aktuelles Passwort */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium mb-1"
                      >
                        Aktuelles Passwort
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Neues Passwort */}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium mb-1"
                      >
                        Neues Passwort
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Passwort-Stärke-Anzeige */}
                      {newPassword && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                newPassword.length < 6
                                  ? "bg-red-500"
                                  : newPassword.length < 10
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  newPassword.length * 10
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs mt-1 text-gray-400">
                            {newPassword.length < 6
                              ? "Schwaches Passwort"
                              : newPassword.length < 10
                              ? "Mittleres Passwort"
                              : "Starkes Passwort"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Passwort bestätigen */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium mb-1"
                      >
                        Passwort bestätigen
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10 ${
                            confirmPassword && newPassword !== confirmPassword
                              ? "border border-red-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <span className="text-xs text-red-500 block mt-1">
                          Die Passwörter stimmen nicht überein
                        </span>
                      )}
                    </div>

                    {passwordError && (
                      <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm">
                        {passwordError}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={handlePasswordChange}
                        className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                        disabled={
                          !currentPassword ||
                          !newPassword ||
                          newPassword !== confirmPassword
                        }
                      >
                        <KeyIcon className="w-4 h-4 mr-2" />
                        Passwort ändern
                      </Button>
                    </div>
                  </div>

                  {/* Passwort-Zurücksetzungsbereich */}
                  <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Passwort vergessen?</h4>
                        <p className="text-sm text-gray-200 mt-1">
                          Sie können einen Link zum Zurücksetzen des Passworts
                          an Ihre E-Mail senden
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handlePasswordReset}
                        className="border-pink-500 text-pink-500 hover:bg-pink-500/10 cursor-pointer"
                      >
                        <RefreshCwIcon className="w-4 h-4 mr-2" />
                        Zurücksetzen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              {editing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                  >
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Abbrechen
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                  >
                    ✏️ Bearbeiten
                  </Button>
                  <SignOutButton redirectUrl="/">
                    <Button variant="outline" className="cursor-pointer">
                      🔒 Logout
                    </Button>
                  </SignOutButton>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tickets-Tab - Mit verbesserter API-Integration */}
        {activeTab === "tickets" && (
          <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Meine Tickets</h2>

            {/* Fehlermeldung */}
            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 mb-4 rounded-md">
                <p>
                  Beim Laden der Tickets ist ein Fehler aufgetreten. Bitte
                  versuchen Sie es erneut.
                </p>
                <button
                  onClick={fetchTickets}
                  className="text-sm underline mt-2"
                >
                  Erneut versuchen
                </button>
              </div>
            )}

            {/* Ladezustand */}
            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-gray-400">Ihre Tickets werden geladen...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-10">
                <Ticket className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Du hast noch keine Tickets gekauft.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer"
                >
                  Events entdecken
                </Link>
              </div>
            ) : (
              <EventList events={ticketsAsEvents} />
            )}
          </div>
        )}

        {/* Besuchte Events-Tab */}
        {activeTab === "history" && (
          <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Besuchte Events</h2>

            {attendedEvents.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Du hast noch keine Events besucht.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attendedEvents.map((event) => (
                  <div
                    key={event.slug || event.id}
                    className="border border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="h-40 relative">
                      <div className="absolute inset-0 bg-black/50 z-10">
                        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                          Besucht
                        </div>
                      </div>
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {event.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{event.title}</h3>

                      <div className="mt-2 flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.date}
                      </div>

                      <div className="mt-1 flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>

                      {/* <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          className="text-pink-400 border-pink-400 hover:bg-pink-400/10 cursor-pointer"
                          onClick={() => alert(`Bewertung für ${event.title}`)}
                        >
                          Bewertung schreiben
                        </Button>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Kommende Events-Tab */}
        {activeTab === "upcoming" && (
          <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Kommende Events</h2>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-10">
                <Clock className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Du hast keine kommenden Events geplant.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition cursor-pointer"
                >
                  Events entdecken
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.slug || event.id}
                    className="flex flex-col md:flex-row gap-4 bg-gray-800/50 p-4 rounded-lg"
                  >
                    {/* Event-Bild */}
                    {event.imageUrl ? (
                      <div className="h-28 w-full md:w-40 relative rounded-lg overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-28 w-full md:w-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">
                          {event.title}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <span className="text-pink-400 font-medium">
                          Ticket vorhanden
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.date}
                      </div>

                      <div className="mt-1 text-sm text-gray-300 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link href={`/events/${event.slug || event.id}`}>
                          <Button className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer">
                            Details <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
