import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // Benutzer-Authentifizierung prüfen
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Nur die Tickets des angemeldeten Benutzers abrufen
    const tickets = await Ticket.find({ userId })
      .sort({ purchaseDate: -1 });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Fehler beim Abrufen der Tickets:', error);
    return NextResponse.json(
      { error: 'Beim Abrufen der Tickets ist ein Fehler aufgetreten.' }, 
      { status: 500 }
    );
  }
}