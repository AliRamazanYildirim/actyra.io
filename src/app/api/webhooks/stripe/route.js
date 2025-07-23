import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const bodyBuffer = Buffer.from(await request.arrayBuffer());
    const signature = request.headers.get("stripe-signature");


    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Fehlende Webhook-Signatur oder Secret" },
        { status: 400 }
      );
    }

    let event;
    try {
      // Verifiziere die Webhook-Signatur
      event = stripe.webhooks.constructEvent(bodyBuffer, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook Signatur-Fehler: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Signatur-Fehler: ${err.message}` },
        { status: 400 }
      );
    }

    // Verbindung zur Datenbank herstellen
    await dbConnect();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        await Ticket.updateMany(
          { paymentId: paymentIntent.id },
          {
            $set: {
              paymentStatus: "completed",
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      case "payment_intent.payment_failed": {
        const failedPayment = event.data.object;
        await Ticket.updateMany(
          { paymentId: failedPayment.id },
          {
            $set: {
              paymentStatus: "failed",
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const refundedPaymentIntent = charge.payment_intent;
        await Ticket.updateMany(
          { paymentId: refundedPaymentIntent },
          {
            $set: {
              paymentStatus: "refunded",
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      default:
        // Keine Aktion für andere Events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler bei der Verarbeitung des Webhooks" },
      { status: 500 }
    );
  }
}
