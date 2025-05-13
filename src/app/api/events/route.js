import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

// GET: Gibt alle Events zurück (sortiert nach Datum)
export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({}).sort({ date: 1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fehler beim Abrufen der Events:', error);
    return NextResponse.json({ error: 'Beim Abrufen der Events ist ein Fehler aufgetreten.' }, { status: 500 });
  }
}

// POST: Erstellt ein neues Event (für Admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      location,
      date,
      price,
      imageUrl,
      slug,
      tags,
      shortDescription,
      longDescription
    } = body;

    // Pflichtfelder prüfen
    if (!title || !location || !date || !slug) {
      return NextResponse.json({ error: 'Erforderliche Eventinformationen fehlen.' }, { status: 400 });
    }

    await dbConnect();

    // Prüfen, ob ein Event mit dem gleichen Slug bereits existiert
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json({ error: 'Ein Event mit diesem Slug existiert bereits.' }, { status: 400 });
    }

    const newEvent = await Event.create({
      title,
      location,
      date,
      price,
      imageUrl,
      slug,
      tags,
      shortDescription,
      longDescription
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Events:', error);
    return NextResponse.json({ error: 'Beim Erstellen des Events ist ein Fehler aufgetreten.' }, { status: 500 });
  }
}
