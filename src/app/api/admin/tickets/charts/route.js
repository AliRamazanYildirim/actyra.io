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
          paymentStatus: "completed"
        }
      },
      {
        $group: {
          _id: "$eventTitle",
          tickets: { $sum: "$quantity" },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { tickets: -1 } },
      { $limit: 10 }
    ]);

    // Andere Diagrammdaten werden leer zurückgegeben, nur für topEvents
    return NextResponse.json({
      dailySales: [],
      statusDistribution: [],
      paymentMethods: [],
      topEvents: topEvents.map(item => ({
        event: item._id || "Unbekanntes Event",
        tickets: item.tickets || 0,
        revenue: item.revenue || 0
      })),
      hourlyDistribution: []
    });
  } catch (error) {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
