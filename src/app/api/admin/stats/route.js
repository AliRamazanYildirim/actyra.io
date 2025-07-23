import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }
    // Überprüfe, ob der Benutzer authentifiziert ist
    await dbConnect();
    const currentUser = await User.findOne({ clerkId: userId });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Keine Admin-Berechtigung" },
        { status: 403 }
      );
    }

    // Echte Datenbankstatistiken - ES6+ async/await
    const [
      totalUsers,
      totalEvents,
      totalTickets,
      pendingEvents,
      activeEvents,
      completedEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Ticket.countDocuments(),
      Event.countDocuments({ status: "pending" }),
      Event.countDocuments({ status: "active" }),
      Event.countDocuments({ status: "completed" }),
    ]);

    // Gesamteinnahmen berechnen: paymentStatus: 'completed' ve price * quantity
    const totalRevenueAgg = await Ticket.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$price", { $ifNull: ["$quantity", 1] }] },
          },
        },
      },
    ]);

    // Anzahl fehlgeschlagener Zahlungen
    const failedPayments = await Ticket.countDocuments({
      paymentStatus: "failed",
    });

    // Nur abgeschlossene Tickets zählen
    const completedTicketsCount = await Ticket.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$quantity", 1] } },
        },
      },
    ]);

    const stats = {
      totalUsers,
      totalEvents,
      totalTickets,
      totalTicketsSold: completedTicketsCount[0]?.total || 0,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      pendingEvents,
      activeEvents,
      completedEvents,
      failedPayments,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin-Statistikfehler:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
