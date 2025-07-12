import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Ticket from '@/models/Ticket';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if user is admin or veranstalter
    const user = await User.findOne({ clerkId: userId });
    if (!user || !['admin', 'veranstalter'].includes(user.role)) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.paymentStatus = status;
    }
    if (search) {
      filter.$or = [
        { eventTitle: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Get tickets with pagination
    const skip = (page - 1) * limit;
    const tickets = await Ticket.find(filter)
      .sort({ purchaseDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await Ticket.countDocuments(filter);
    const totalPages = Math.ceil(totalTickets / limit);

    return NextResponse.json({
      tickets,
      pagination: {
        currentPage: page,
        totalPages,
        totalTickets,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Tickets:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
