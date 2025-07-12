import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const { clerkId, email, fullName, role = 'user' } = await request.json();

    await dbConnect();
    
    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      return NextResponse.json({ 
        message: 'Benutzer bereits vorhanden',
        user: {
          id: existingUser._id,
          clerkId: existingUser.clerkId,
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role,
        }
      });
    }

    // Yeni kullanıcı oluştur
    const newUser = new User({
      clerkId: userId,
      email,
      fullName,
      role,
    });

    await newUser.save();

    return NextResponse.json({
      message: 'Benutzer erfolgreich erstellt',
      user: {
        id: newUser._id,
        clerkId: newUser.clerkId,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
