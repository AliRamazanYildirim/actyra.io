import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

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

  // Tickets und Events auslesen
  const [tickets, events, categories] = await Promise.all([
    Ticket.find({ purchaseDate: { $gte: startDate } }),
    Event.find({ createdAt: { $gte: startDate } }),
    Category.find({}),
  ]);

  // Ticket Stats
  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(
    (t) => t.paymentStatus === "completed"
  ).length;
  const failedTickets = tickets.filter(
    (t) => t.paymentStatus === "failed"
  ).length;
  const totalRevenue = tickets
    .filter((t) => t.paymentStatus === "completed")
    .reduce((sum, t) => sum + (t.totalPrice || 0), 0);
  const averageOrderValue =
    completedTickets > 0 ? totalRevenue / completedTickets : 0;
  const conversionRate =
    totalTickets > 0 ? ((completedTickets / totalTickets) * 100).toFixed(1) : 0;
  const refundRate =
    completedTickets > 0
      ? ((failedTickets / completedTickets) * 100).toFixed(1)
      : 0;

  // Event Stats
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "active").length;
  const totalTicketsSold = tickets.reduce(
    (sum, t) => sum + (t.quantity || 1),
    0
  );
  const averageEventPrice =
    totalEvents > 0
      ? events.reduce((sum, e) => sum + (e.price || 0), 0) / totalEvents
      : 0;
  const completionRate =
    totalEvents > 0
      ? (events.filter((e) => e.status === "completed").length / totalEvents) *
        100
      : 0;

  // Kategorien
  const categoryCount = {};
  events.forEach((e) => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
  });
  const popularCategory = Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    "—"
  );

  // Top Events
  const eventRevenueMap = {};
  tickets.forEach((t) => {
    eventRevenueMap[t.eventTitle] =
      (eventRevenueMap[t.eventTitle] || 0) + (t.totalPrice || 0);
  });
  const topEvents = Object.entries(eventRevenueMap)
    .map(([title, revenue]) => ({
      event: title,
      tickets: tickets
        .filter((t) => t.eventTitle === title)
        .reduce((sum, t) => sum + (t.quantity || 1), 0),
      revenue,
    }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 10);

  // Top Kategorien
  const categoryRevenueMap = {};
  tickets.forEach((t) => {
    const event = events.find((e) => e.title === t.eventTitle);
    if (event) {
      categoryRevenueMap[event.category] =
        (categoryRevenueMap[event.category] || 0) + (t.totalPrice || 0);
    }
  });
  const topCategories = Object.entries(categoryRevenueMap)
    .map(([cat, revenue]) => ({
      name: cat,
      events: events.filter((e) => e.category === cat).length,
      revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Übersicht
  const overview = {
    totalRevenue,
    totalTickets,
    completedTickets,
    averageOrderValue,
    conversionRate,
    refundRate,
    totalEvents,
    activeEvents,
    totalTicketsSold,
    averageEventPrice,
    completionRate,
    popularCategory,
    topEvent: topEvents[0]?.event || "—",
    avgAttendeesPerEvent: totalEvents > 0 ? totalTicketsSold / totalEvents : 0,
  };

  return NextResponse.json({
    overview,
    topEvents,
    topCategories,
  });
}
