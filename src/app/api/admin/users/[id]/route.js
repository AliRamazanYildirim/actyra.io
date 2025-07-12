import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if user is admin
    const requestingUser = await User.findOne({ clerkId: userId });
    if (!requestingUser || requestingUser.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if user is admin
    const requestingUser = await User.findOne({ clerkId: userId });
    if (!requestingUser || requestingUser.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }

    const { fullName, role } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { 
        ...(fullName && { fullName }),
        ...(role && { role })
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if user is admin
    const requestingUser = await User.findOne({ clerkId: userId });
    if (!requestingUser || requestingUser.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }

    // Don't allow admin to delete themselves
    const userToDelete = await User.findById(params.id);
    if (userToDelete.clerkId === userId) {
      return NextResponse.json({ error: 'Sie können sich nicht selbst löschen' }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(params.id);
    
    if (!deletedUser) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
