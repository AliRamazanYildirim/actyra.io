import dbConnect from "../db.js";
import Event from "../../models/Event.js";
import eventSeedData from "../../data/eventSeedData.js";

async function seedEventsIfEmpty() {
  console.log("📡 Verbindung zur Datenbank wird hergestellt...");
  await dbConnect();

  // Alle Events löschen
  const deleted = await Event.deleteMany({});
  console.log(`🗑️ ${deleted.deletedCount} Events wurden gelöscht.`);

  // Seed-Daten hinzufügen
  const inserted = await Event.insertMany(eventSeedData);
  console.log(`✅ ${inserted.length} Events wurden erfolgreich hinzugefügt.`);
}

//Skript wird bei direkter Ausführung automatisch ausgeführt
seedEventsIfEmpty()
  .then(() => {
    console.log("🚀 Seed-Vorgang abgeschlossen.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fehler beim Seed-Vorgang:", error);
    process.exit(1);
  });
