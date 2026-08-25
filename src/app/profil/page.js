"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ProfileTabs from "@/components/ProfileTabs";
import ProfileContent from "@/components/ProfileContent";
import TicketsList from "@/components/TicketsList";
import AttendedEvents from "@/components/AttendedEvents";
import UpcomingEvents from "@/components/UpcomingEvents";
import useTicketStore from "@/store/ticketStore";
import { User, Sparkles } from "lucide-react";

export default function ProfilPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profil");
  const fetchTickets = useTicketStore((state) => state.fetchTickets);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (activeTab === "tickets" && user) {
      fetchTickets();
    }
  }, [activeTab, user, fetchTickets]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-32 px-4 max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3 animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="space-y-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          <span>Kontoübersicht</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Mein{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Profil & Tickets
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Verwalte deine persönlichen Daten und behalte alle deine gebuchten Event-Tickets im Blick.
        </p>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profil" && <ProfileContent user={user} />}
        {activeTab === "tickets" && <TicketsList />}
        {activeTab === "history" && <AttendedEvents />}
        {activeTab === "upcoming" && <UpcomingEvents />}
      </div>
    </div>
  );
}