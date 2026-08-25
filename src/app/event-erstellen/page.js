// src/app/event-erstellen/page.js
// Seite für Event-Erstellung - Creator Studio

import HeroEventErstellen from "@/components/HeroEventErstellen";
import EventErstellenForm from "@/components/EventErstellenForm";

export const metadata = {
  title: "Event erstellen | Actyra Creator Studio",
  description:
    "Erstelle und veröffentliche dein Event auf Actyra mit automatischem Social Impact.",
};

const EventErstellenPage = () => {
  return (
    <div className="min-h-screen">
      <HeroEventErstellen />

      <main className="pb-24">
        <EventErstellenForm />
      </main>
    </div>
  );
};

export default EventErstellenPage;
