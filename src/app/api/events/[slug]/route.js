import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import eventsData from "@/data/eventSeedData";

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    const event = await Event.findOne({ slug });
    if (event) {
      return NextResponse.json({
        event: JSON.parse(JSON.stringify(event)),
        source: "database",
      });
    }
  } catch (dbError) {
    console.error("Datenbankfehler:", dbError);
  }

  const seedEvent = eventsData.find((e) => e.slug === slug);
  if (seedEvent) {
    return NextResponse.json({
      event: seedEvent,
      source: "seed",
    });
  }

  return NextResponse.json(
    { error: "Event nicht gefunden" },
    { status: 404 }
  );
}
