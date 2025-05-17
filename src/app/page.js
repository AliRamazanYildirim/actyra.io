//!Components
import HeroComp from "@/components/HeroComp";
import EventCardsIntro from "@/components/EventCardsIntro";
import EventListSection from "@/components/EventListSection";
import KategorienSection from "@/components/KategorienSection";
import WaveSeparator from "@/components/WaveSeparator";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 Sek wartenawait 
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
