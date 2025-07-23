import { NextResponse } from "next/server";
import { calculateTotalRevenue } from "@/lib/calculateTotalRevenue";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import Category from "@/models/Category";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";

  // Zeitraum berechnen
  const now = new Date();
  let startDate;
  switch (range) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Events und Tickets auslesen
  const [events, tickets, categories] = await Promise.all([
    Event.find({ createdAt: { $gte: startDate } }),
    Ticket.find({ purchaseDate: { $gte: startDate } }),
    Category.find({}),
  ]);

  // Event Stats
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "active").length;
  const completedEvents = events.filter((e) => e.status === "completed").length;
  const totalTicketsSold = tickets.reduce(
    (sum, t) => sum + (t.quantity || 1),
    0
  );
  const totalRevenue = calculateTotalRevenue(
    tickets.filter((t) => t.paymentStatus === "completed")
  );
  const averageEventPrice =
    totalEvents > 0
      ? events.reduce((sum, e) => sum + (e.price || 0), 0) / totalEvents
      : 0;
  const completionRate =
    totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  // Kategorien
  const categoryCount = {};
  events.forEach((e) => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
  });
  const popularCategory = Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    "—"
  );

  // Top Event
  const eventRevenueMap = {};
  tickets.forEach((t) => {
    eventRevenueMap[t.eventTitle] =
      (eventRevenueMap[t.eventTitle] || 0) + (t.totalPrice || 0);
  });
  const topEvent =
    Object.entries(eventRevenueMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return NextResponse.json({
    stats: {
      totalEvents,
      activeEvents,
      totalTicketsSold,
      totalRevenue,
      averageEventPrice,
      completionRate,
      popularCategory,
      topEvent,
    },
  });
}
