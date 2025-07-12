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

    await dbConnect();

    // GEÇICI: Tüm giriş yapmış kullanıcıları admin olarak kabul et
    // Check if user is admin or veranstalter
    // const user = await User.findOne({ clerkId: userId });
    // if (!user || !['admin', 'veranstalter'].includes(user.role)) {
    //   return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    // }

    // Collect statistics
    const stats = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Ticket.countDocuments(),
      Ticket.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Event.countDocuments({
        date: { $gte: new Date().toISOString().split("T")[0] },
      }),
      Event.countDocuments({
        date: { $lt: new Date().toISOString().split("T")[0] },
      }),
      Ticket.countDocuments({ paymentStatus: "failed" }),
    ]);

    const dashboardStats = {
      totalUsers: stats[0],
      totalEvents: stats[1],
      totalTickets: stats[2],
      totalRevenue: stats[3][0]?.total || 0,
      pendingEvents: 0, // Placeholder for pending events
      activeEvents: stats[4],
      completedEvents: stats[5],
      failedPayments: stats[6],
    };

    // Generate chart data
    const chartData = {
      weeklyRevenue: await generateWeeklyRevenueData(),
      eventsByCategory: await generateEventsByCategoryData(),
      userGrowth: await generateUserGrowthData(),
    };

    return NextResponse.json({
      stats: dashboardStats,
      charts: chartData,
    });
  } catch (error) {
    console.error("Fehler beim Laden der Dashboard-Daten:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

async function generateWeeklyRevenueData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyData = await Ticket.aggregate([
    {
      $match: {
        purchaseDate: { $gte: sevenDaysAgo },
        paymentStatus: "completed",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" },
        },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill missing days with 0
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = weeklyData.find((d) => d._id === dateStr);

    result.push({
      label: date.toLocaleDateString("de-DE", { weekday: "short" }),
      value: dayData?.revenue || 0,
    });
  }

  return result;
}

async function generateEventsByCategoryData() {
  const categoryData = await Event.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  return categoryData.map((item) => ({
    label: item._id,
    value: item.count,
  }));
}

async function generateUserGrowthData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const userData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        users: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return userData.map((item) => ({
    label: new Date(item._id).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    }),
    value: item.users,
  }));
}
