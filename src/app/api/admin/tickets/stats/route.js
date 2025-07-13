import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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

    await dbConnect();

    // Check if user is admin or veranstalter
    const user = await User.findOne({ clerkId: userId });
    if (!user || !["admin", "veranstalter"].includes(user.role)) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
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

    // Get ticket statistics with date range
    const [
      totalTickets,
      completedTickets,
      pendingTickets,
      failedTickets,
      totalRevenueAgg,
      averageOrderValueAgg,
    ] = await Promise.all([
      Ticket.countDocuments({ purchaseDate: { $gte: startDate } }),
      Ticket.countDocuments({
        purchaseDate: { $gte: startDate },
        paymentStatus: "completed",
      }),
      Ticket.countDocuments({
        purchaseDate: { $gte: startDate },
        paymentStatus: "pending",
      }),
      Ticket.countDocuments({
        purchaseDate: { $gte: startDate },
        paymentStatus: "failed",
      }),
      Ticket.aggregate([
        {
          $match: {
            purchaseDate: { $gte: startDate },
            paymentStatus: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Ticket.aggregate([
        {
          $match: {
            purchaseDate: { $gte: startDate },
            paymentStatus: "completed",
          },
        },
        { $group: { _id: null, avg: { $avg: "$totalPrice" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const averageOrderValue = averageOrderValueAgg[0]?.avg || 0;

    // Top Events nach Ticket-Verkäufen
    const topEventsAgg = await Ticket.aggregate([
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

    const ticketStats = {
      totalTickets,
      completedTickets,
      pendingTickets,
      failedTickets,
      totalRevenue,
      averageOrderValue,
      conversionRate:
        totalTickets > 0
          ? ((completedTickets / totalTickets) * 100).toFixed(1)
          : 0,
      refundRate:
        completedTickets > 0
          ? ((failedTickets / completedTickets) * 100).toFixed(1)
          : 0,
      topEvents: topEventsAgg.map((item) => ({
        event: item._id || "Unbekanntes Event",
        tickets: item.tickets || 0,
        revenue: item.revenue || 0,
      })),
    };

    return NextResponse.json({
      success: true,
      stats: ticketStats,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Ticket-Statistiken:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
