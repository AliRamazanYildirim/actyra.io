// src/app/event-erstellen/page.js
// Seite für Event-Erstellung - bindet das Event-Formular ein

import HeroEventErstellen from "@/components/HeroEventErstellen";
import EventForm from "@/components/EventForm";

export const metadata = {
  title: "Event erstellen | Actyra",
  description: "Erstelle dein eigenes Event und veröffentliche es auf Actyra.",
};

const EventErstellenPage = () => {
  return (
    <>
      {/* Hero vollflächig */}
      <HeroEventErstellen />

      {/* Ab hier normaler gepaddeter Bereich */}
      <main className="min-h-screen dark-light-mode pt-5">
        <div className="container mx-auto">
          <EventForm />
        </div>
      </main>
    </>
  );
};

export default EventErstellenPage;
