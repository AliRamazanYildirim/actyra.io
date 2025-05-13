import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    await dbConnect();
    
    const event = await Event.findOne({ slug });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event });
  } catch (error) {
    console.error('Fehler beim Abrufen des Events:', error);
    return NextResponse.json(
      { error: 'Beim Abrufen des Events ist ein Fehler aufgetreten.' },
      { status: 500 }
    );
  }
}