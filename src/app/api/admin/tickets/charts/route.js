import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { subDays, format } from "date-fns";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const now = new Date();
    let startDate;
    switch (range) {
      case "7d":
        startDate = subDays(now, 7);
        break;
      case "30d":
        startDate = subDays(now, 30);
        break;
      case "90d":
        startDate = subDays(now, 90);
        break;
      case "1y":
        startDate = subDays(now, 365);
        break;
      default:
        startDate = subDays(now, 30);
    }

    // Top Events
    const topEvents = await Ticket.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$eventTitle",
          tickets: { $sum: "$quantity" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { tickets: -1 } },
      { $limit: 10 },
    ]);

    // Tägliche Ticket-Verkäufe
    const dailySales = await Ticket.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          tickets: { $sum: "$quantity" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Status Verteilung
    const statusDistribution = await Ticket.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          paymentStatus: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Umsatz Trend
    const revenueTrend = dailySales.map((day) => ({
      date: day._id,
      revenue: day.revenue || 0,
    }));

    // Zahlungsmethoden
    const paymentMethods = await Ticket.aggregate([
      {
        $match: {
          purchaseDate: { $gte: startDate },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    return NextResponse.json({
      dailySales: dailySales.map((day) => ({
        date: day._id,
        tickets: day.tickets || 0,
        revenue: day.revenue || 0,
      })),
      statusDistribution: statusDistribution.map((item) => {
        // Renk ve isim eşleştirmesi
        let color = "#64748b";
        let name = "Unbekannt";
        if (item._id === "completed") {
          color = "#22c55e";
          name = "Abgeschlossen";
        } else if (item._id === "pending") {
          color = "#eab308";
          name = "Ausstehend";
        } else if (item._id === "failed") {
          color = "#ef4444";
          name = "Fehlgeschlagen";
        } else if (item._id) {
          name = item._id;
        }
        return {
          name,
          value: item.count || 0,
          color,
        };
      }),
      revenueTrend,
      paymentMethods: paymentMethods.map((item) => ({
        method: item._id || "Unbekannt",
        count: item.count || 0,
        revenue: item.revenue || 0,
      })),
      topEvents: topEvents.map((item) => ({
        event: item._id || "Unbekanntes Event",
        tickets: item.tickets || 0,
        revenue: item.revenue || 0,
      })),
      hourlyDistribution: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
