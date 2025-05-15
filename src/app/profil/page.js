"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import ProfileTabs from "@/components/ProfileTabs";
import ProfileContent from "@/components/ProfileContent";
import TicketsList from "@/components/TicketsList";
import AttendedEvents from "@/components/AttendedEvents";
import UpcomingEvents from "@/components/UpcomingEvents";
import useTicketStore from "@/store/ticketStore";

export default function ProfilPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profil");
  const fetchTickets = useTicketStore((state) => state.fetchTickets);

  // Benutzerladezustand
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Tickets laden
  useEffect(() => {
    if (activeTab === "tickets" && user) {
      fetchTickets();
    }
  }, [activeTab, user, fetchTickets]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-500">
        Profil wird geladen...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-24 space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Mein Profil
        </h1>

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Inhalt basierend auf dem ausgewählten Tab */}
        {activeTab === "profil" && <ProfileContent user={user} />}
        {activeTab === "tickets" && <TicketsList />}
        {activeTab === "history" && <AttendedEvents />}
        {activeTab === "upcoming" && <UpcomingEvents />}
      </main>
    </div>
  );
}