import { Webhook } from "svix";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET fehlt");
    return new Response("Fehlende Server-Konfiguration", { status: 500 });
  }

  // ✅ Header direkt aus req.headers abrufen
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Fehlende Webhook-Header");
    return new Response("Fehlende Header", { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("❌ Fehler beim Parsen:", err);
    return new Response("Ungültiger JSON-Body", { status: 400 });
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
    console.error("❌ Webhook-Verifizierung fehlgeschlagen:", err);
    return new Response("Ungültige Signatur", { status: 400 });
  }

  const { type, data } = evt;
  console.log("📨 Webhook-Ereignis:", type);

  if (type === "user.created") {
    try {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses?.[0]?.email_address;

      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log("ℹ️ Benutzer existiert bereits:", email);
        return new Response("Benutzer existiert bereits", { status: 200 });
      }

      const newUser = await User.create({
        clerkId: id,
        email,
        fullName: `${first_name || ""} ${last_name || ""}`.trim(),
        role: "user", // Immer als Benutzer hinzufügen
      });

      console.log("✅ Neuer Benutzer erstellt:", newUser.email);
      return new Response(JSON.stringify(newUser), { status: 201 });
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      return new Response("Fehler bei der Benutzererstellung", { status: 500 });
    }
  }

  // user.updated event: Benutzer, der nicht in der Datenbank ist, automatisch hinzufügen
  if (type === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses?.[0]?.email_address;

      let user = await User.findOne({ clerkId: id });
      if (!user) {
        user = await User.create({
          clerkId: id,
          email,
          fullName: `${first_name || ""} ${last_name || ""}`.trim(),
          role: "user",
        });
        console.log("✅ Benutzer nachträglich erstellt:", user.email);
      }
      // Wenn du möchtest, kannst du hier auch Änderungen vornehmen.
      return new Response("Benutzer synchronisiert", { status: 200 });
    } catch (err) {
      console.error("❌ Fehler beim Synchronisieren:", err);
      return new Response("Fehler bei der Benutzersynchronisierung", {
        status: 500,
      });
    }
  }

  // user.deleted event: Benutzer aus der Datenbank löschen
  if (type === "user.deleted") {
    try {
      const { id } = data;
      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      if (deletedUser) {
        console.log("🗑️ Benutzer gelöscht:", deletedUser.email);
        return new Response("Benutzer gelöscht", { status: 200 });
      } else {
        console.log("ℹ️ Benutzer zum Löschen nicht gefunden:", id);
        return new Response("Benutzer nicht gefunden", { status: 404 });
      }
    } catch (err) {
      console.error("❌ Fehler beim Löschen:", err);
      return new Response("Fehler beim Löschen des Benutzers", { status: 500 });
    }
  }

  return new Response(`Unhandled event type: ${type}`, { status: 200 });
}
