import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // Überprüft, ob der Benutzer authentifiziert ist
        if (!userId) {
            return NextResponse.json(
                { error: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });

        // Überprüft, ob der Benutzer Admin-Rechte hat
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Keine Admin-Berechtigung" },
                { status: 403 }
            );
        }

        // Benutzerwachstum der letzten 7 Tage - ES6+ Arrow Functions
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 7 },
        ]).then((data) =>
            data.reverse().map((item, index) => ({
                label: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][index] || item._id,
                value: item.count,
            }))
        );

        // Verteilung der Event-Kategorien
        const eventStats = await Event.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ]).then((data) =>
            data.map((item) => ({
                label: item._id || "Diğer",
                value: item.count,
            }))
        );

        // Einnahmenfluss der letzten 6 Monate
        const revenueFlow = await Ticket.aggregate([
            {
                $match: { paymentStatus: "completed" },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$createdAt" },
                    },
                    total: { $sum: "$price" },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 6 },
        ]).then((data) =>
            data.reverse().map((item, index) => ({
                label:
                    ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"][index] ||
                    item._id.slice(-2),
                value: Math.round(item.total),
            }))
        );

        // Chart-Daten werden vorbereitet
        const chartData = {
            userGrowth:
                userGrowth.length > 0
                    ? userGrowth
                    : [
                            { label: "Mo", value: 0 },
                            { label: "Di", value: 0 },
                            { label: "Mi", value: 0 },
                            { label: "Do", value: 0 },
                            { label: "Fr", value: 0 },
                            { label: "Sa", value: 0 },
                            { label: "So", value: 0 },
                        ],
            eventStats:
                eventStats.length > 0
                    ? eventStats
                    : [{ label: "Keine Events", value: 1 }],
            revenueFlow:
                revenueFlow.length > 0
                    ? revenueFlow
                    : [
                            { label: "Jan", value: 0 },
                            { label: "Feb", value: 0 },
                            { label: "Mär", value: 0 },
                            { label: "Apr", value: 0 },
                            { label: "Mai", value: 0 },
                            { label: "Jun", value: 0 },
                        ],
        };

        return NextResponse.json(chartData);
    } catch (error) {
        // Fehler beim Abrufen der Chart-Daten
        console.error("Diagrammdatenfehler:", error);
        return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
    }
}
