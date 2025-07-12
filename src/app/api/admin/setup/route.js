import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Temporäre Route zum ersten Admin erstellen
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    await dbConnect();
    
    // Prüfen ob bereits ein Admin existiert
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Es existiert bereits ein Administrator' 
      }, { status: 400 });
    }

    // Aktuellen Benutzer zum Admin machen
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ 
        error: 'Benutzer nicht gefunden' 
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Sie wurden erfolgreich zum Administrator gemacht',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Fehler beim Admin-Setup:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
