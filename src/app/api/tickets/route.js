import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Stripe-Objekt erstellen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET-Methode mit korrigierter auth()-Funktion
export async function GET(request) {
  try {
    // Korrigierte Authentifizierung
    const auth = getAuth(request);
    const userId = auth.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Tickets aus der Datenbank abrufen
    const tickets = await Ticket.find({ userId })
      .sort({ purchaseDate: -1 });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Fehler beim Abrufen der Tickets:', error);
    return NextResponse.json(
      { error: 'Es gab einen Fehler beim Abrufen der Tickets.' }, 
      { status: 500 }
    );
  }
}

// POST-Methode mit korrigierter auth()-Funktion und return-Statement
export async function POST(request) {
  try {
    // Korrigierte Authentifizierung mit optionalem Benutzer
    let userId = null;
    try {
      const auth = getAuth(request);
      userId = auth?.userId || null;
    } catch (authError) {
      console.log('Benutzer nicht authentifiziert, fahre als Gast fort');
    }
    
    const data = await request.json();
    
    await dbConnect();
    
    // Stripe Payment Intent erstellen
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((data.totalAmount || 0) * 100), // In Cent (z.B. 10.50€ = 1050)
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId: userId || 'guest',
        eventDetails: JSON.stringify(data.cartTickets.map(t => ({ 
          slug: t.slug, 
          title: t.eventTitle,
          quantity: t.quantity
        })))
      }
    });
    
    // Einzigartige Bestellnummer generieren
    const orderNumber = `BNR${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Tickets in der Datenbank speichern
    const savedTickets = await Promise.all(data.cartTickets.map(async (ticket) => {
      const newTicket = new Ticket({
        userId: userId || 'guest',
        slug: ticket.slug,
        eventTitle: ticket.eventTitle,
        location: ticket.location,
        date: ticket.date,
        price: ticket.price,
        quantity: ticket.quantity,
        totalPrice: ticket.totalPrice,
        totalDonation: ticket.totalDonation || 0,
        imageUrl: ticket.imageUrl || '',
        orderNumber: orderNumber,
        customerName: data.name,
        customerEmail: data.email,
        paymentMethod: data.paymentMethod || 'creditcard',
        paymentStatus: 'pending',
        paymentId: paymentIntent.id
      });
      
      // Wichtig: return hinzufügen, damit das Ticket zurückgegeben wird
      return await newTicket.save();
    }));
    
    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      clientSecret: paymentIntent.client_secret,
      tickets: savedTickets
    });
    
  } catch (error) {
    console.error('Fehler bei der Zahlungsabwicklung:', error);
    return NextResponse.json(
      { error: `Es gab einen Fehler bei der Zahlungsabwicklung: ${error.message}` },
      { status: 500 }
    );
  }
}