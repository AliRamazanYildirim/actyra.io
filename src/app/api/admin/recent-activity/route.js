import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

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

    // ES6+ Mock activities with template literals
    const mockActivities = [
      {
        id: 1,
        type: "user_registered",
        description: "Neuer Benutzer Max Mustermann registriert",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        userId: "user_" + Math.random().toString(36).substr(2, 9),
      },
      {
        id: 2,
        type: "event_created",
        description: 'Event "Tech Conference 2025" wurde erstellt',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        eventId: "event_" + Math.random().toString(36).substr(2, 9),
      },
      {
        id: 3,
        type: "ticket_purchased",
        description: '3 Tickets für "Kunstworkshop" verkauft',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        amount: 89.5,
      },
      {
        id: 4,
        type: "payment_completed",
        description: "Zahlung über €145.00 abgeschlossen",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        amount: 145.0,
      },
      {
        id: 5,
        type: "user_registered",
        description: "Neuer Benutzer Anna Schmidt registriert",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        userId: "user_" + Math.random().toString(36).substr(2, 9),
      },
      {
        id: 6,
        type: "event_created",
        description: 'Event "Business Networking" wurde erstellt',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        eventId: "event_" + Math.random().toString(36).substr(2, 9),
      },
    ];

    // ES6+ Response with spread operator
    return NextResponse.json({
      success: true,
      activities: mockActivities,
      total: mockActivities.length,
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
