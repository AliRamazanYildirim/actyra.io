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

    // Get ticket statistics
    const stats = await Promise.all([
      // Total tickets
      Ticket.countDocuments(),
      // Completed tickets
      Ticket.countDocuments({ paymentStatus: 'completed' }),
      // Pending tickets
      Ticket.countDocuments({ paymentStatus: 'pending' }),
      // Failed tickets
      Ticket.countDocuments({ paymentStatus: 'failed' }),
      // Total revenue from completed tickets
      Ticket.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ])
    ]);

    const ticketStats = {
      total: stats[0],
      completed: stats[1],
      pending: stats[2],
      failed: stats[3],
      totalRevenue: stats[4][0]?.total || 0,
    };

    return NextResponse.json({
      stats: ticketStats
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Ticket-Statistiken:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
