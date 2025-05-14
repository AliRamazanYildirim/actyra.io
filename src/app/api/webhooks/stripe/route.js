import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');
    
    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Fehlende Webhook-Signatur oder Secret' }, 
        { status: 400 }
      );
    }
    
    let event;
    try {
      // Verifiziere die Webhook-Signatur
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook Signatur-Fehler: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Signatur-Fehler: ${err.message}` }, 
        { status: 400 }
      );
    }
    
    // Verbindung zur Datenbank herstellen
    await dbConnect();
    
    // Verschiedene Ereignistypen verarbeiten
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`Zahlung erfolgreich: ${paymentIntent.id}`);
        
        // Falls die Tickets noch nicht gespeichert wurden, könnte der Webhook dies übernehmen
        // Wir könnten hier eine Logik hinzufügen, um Tickets zu speichern, falls die Bestätigung fehlt
        
        // Aktualisiere Tickets, falls vorhanden
        await Ticket.updateMany(
          { paymentId: paymentIntent.id },
          { 
            paymentStatus: 'completed',
            $set: { updatedAt: new Date() }
          }
        );
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`Zahlung fehlgeschlagen: ${failedPayment.id}`);
        
        // Aktualisiere die fehlgeschlagene Zahlung in der Datenbank
        await Ticket.updateMany(
          { paymentId: failedPayment.id },
          { 
            paymentStatus: 'failed',
            $set: { updatedAt: new Date() }
          }
        );
        break;
        
      case 'charge.refunded':
        const charge = event.data.object;
        const refundedPaymentIntent = charge.payment_intent;
        console.log(`Rückerstattung für Zahlung: ${refundedPaymentIntent}`);
        
        // Aktualisiere die zurückerstatteten Tickets
        await Ticket.updateMany(
          { paymentId: refundedPaymentIntent },
          { 
            paymentStatus: 'refunded',
            $set: { updatedAt: new Date() }
          }
        );
        break;
        
      default:
        console.log(`Unbehandeltes Stripe-Ereignis: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler bei der Verarbeitung des Webhooks' },
      { status: 500 }
    );
  }
}