// page.js
import HeroComp from "@/components/HeroComp";

import EventCardsIntro from "@/components/EventCardsIntro";
import EventListSection from "@/components/EventListSection";
import KategorienSection from "@/components/KategorienSection";
import WaveSeparator from "@/components/WaveSeparator";

export default function Home() {
  return (
    <>
      <HeroComp />
      
      <EventCardsIntro />
      <WaveSeparator />
      <EventListSection />
      <KategorienSection />
    </>
  );
}
