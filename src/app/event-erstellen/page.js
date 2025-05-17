// src/app/event-erstellen/page.js
// Seite für Event-Erstellung - bindet das Event-Formular ein

import HeroEventErstellen from "@/components/HeroEventErstellen";
import EventErstellenForm from "@/components/EventErstellenForm";

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
      <main className="min-h-screen  pt-5">
        <div className="container mx-auto">
          <EventErstellenForm />
        </div>
      </main>
    </>
  );
};

export default EventErstellenPage;
