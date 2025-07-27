import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

/**
 * Recent Activity API Endpoint
 * ES6+ and Next.js 15 optimized
 * Returns mock activity data for admin dashboard
 */
export async function GET(request) {
  try {
    // ES6+ Destructuring with error handling
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Echte Aktivitäten aus DB holen
    await dbConnect();

    // Letzte 5 User-Registrierungen
    const users = await User.find({}).sort({ createdAt: -1 }).limit(5).lean();

    // Letzte 5 Events
    const events = await Event.find({}).sort({ createdAt: -1 }).limit(5).lean();

    // Letzte 5 Ticket-Käufe
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Aktivitäten zusammenbauen
    const activities = [];

    users.forEach((user) => {
      activities.push({
        id: `user_${user._id}`,
        type: "user_registered",
        description: `Neuer Benutzer ${
          user.fullName || user.email
        } registriert`,
        timestamp: user.createdAt,
      });
    });

    events.forEach((event) => {
      activities.push({
        id: `event_${event._id}`,
        type: "event_created",
        description: `Event "${event.title}" wurde erstellt`,
        timestamp: event.createdAt,
      });
    });

    tickets.forEach((ticket) => {
      activities.push({
        id: `ticket_${ticket._id}`,
        type: "ticket_purchased",
        description: `${ticket.quantity || 1} Ticket(s) für "${
          ticket.eventTitle
        }" verkauft`,
        timestamp: ticket.createdAt,
      });
      if (ticket.paymentStatus === "completed") {
        activities.push({
          id: `payment_${ticket._id}`,
          type: "payment_completed",
          description: `Zahlung über €${ticket.totalPrice.toFixed(
            2
          )} abgeschlossen`,
          timestamp: ticket.createdAt,
        });
      }
    });

    // Nach Zeit sortieren, neuste zuerst, max 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latestActivities = activities.slice(0, 10);

    return NextResponse.json({
      success: true,
      activities: latestActivities,
      total: latestActivities.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Recent activity API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
