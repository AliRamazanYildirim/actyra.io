import { Webhook } from "svix";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Hilfsfunktion für Webhook-Header und Verifizierung
async function verifyWebhook(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return {
      error: new Response("Fehlende Server-Konfiguration", { status: 500 }),
    };
  }
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return { error: new Response("Fehlende Webhook-Header", { status: 400 }) };
  }
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    return { error: new Response("Ungültiger JSON-Body", { status: 400 }) };
  }
  const body = JSON.stringify(payload);
  let evt;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return { error: new Response("Ungültige Signatur", { status: 400 }) };
  }
  return { evt };
}

// POST: Benutzer anlegen (Webhook: type = user.created)
export async function POST(req) {
  await dbConnect();
  const { evt, error } = await verifyWebhook(req);
  if (error) return error;
  const { type, data } = evt;
  if (type !== "user.created") {
    return new Response(`Unhandled event type: ${type}`, { status: 200 });
  }
  const { id, email_addresses, first_name, last_name } = data;
  const email = email_addresses?.[0]?.email_address;
  if (!id || !email) {
    return new Response("Fehlende Felder", { status: 400 });
  }
  const existingUser = await User.findOne({ clerkId: id });
  if (existingUser) {
    return new Response("Benutzer existiert bereits", { status: 200 });
  }
  const newUser = await User.create({
    clerkId: id,
    email,
    fullName: `${first_name || ""} ${last_name || ""}`.trim(),
    role: "user",
  });
  return new Response(JSON.stringify(newUser), { status: 201 });
}

// PUT: Benutzer aktualisieren (Webhook: type = user.updated)
export async function PUT(req) {
  await dbConnect();
  const { evt, error } = await verifyWebhook(req);
  if (error) return error;
  const { type, data } = evt;
  if (type !== "user.updated") {
    return new Response(`Unhandled event type: ${type}`, { status: 200 });
  }
  const { id, email_addresses, first_name, last_name } = data;
  const email = email_addresses?.[0]?.email_address;
  if (!id) {
    return new Response("Fehlende ID", { status: 400 });
  }
  let user = await User.findOne({ clerkId: id });
  if (!user) {
    user = await User.create({
      clerkId: id,
      email,
      fullName: `${first_name || ""} ${last_name || ""}`.trim(),
      role: "user",
    });
    return new Response("Benutzer nachträglich erstellt", { status: 201 });
  }
  if (email) user.email = email;
  if (first_name || last_name)
    user.fullName = `${first_name || ""} ${last_name || ""}`.trim();
  await user.save();
  return new Response("Benutzer aktualisiert", { status: 200 });
}

// DELETE: Benutzer löschen (Webhook: type = user.deleted)
export async function DELETE(req) {
  await dbConnect();
  const { evt, error } = await verifyWebhook(req);
  if (error) return error;
  const { type, data } = evt;
  if (type !== "user.deleted") {
    return new Response(`Unhandled event type: ${type}`, { status: 200 });
  }
  const { id } = data;
  if (!id) {
    return new Response("Fehlende ID", { status: 400 });
  }
  const deletedUser = await User.findOneAndDelete({ clerkId: id });
  if (deletedUser) {
    return new Response("Benutzer gelöscht", { status: 200 });
  } else {
    return new Response("Benutzer nicht gefunden", { status: 404 });
  }
}
