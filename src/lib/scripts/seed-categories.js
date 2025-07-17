import dbConnect from "../db.js";
import Category from "../../models/Category.js";
import categories from "../../data/categories.js";

async function seedCategories() {
  console.log("📡 Verbindung zur Datenbank wird hergestellt...");
  await dbConnect();

  // Alle Kategorien löschen
  const deleted = await Category.deleteMany({});
  console.log(`🗑️ ${deleted.deletedCount} Kategorien wurden gelöscht.`);

  // Seed-Daten hinzufügen
  const inserted = await Category.insertMany(categories);
  console.log(
    `✅ ${inserted.length} Kategorien wurden erfolgreich hinzugefügt.`
  );
}

// Beim direkten Ausführen des Skripts automatisch starten
seedCategories()
  .then(() => {
    console.log("🚀 Kategorie-Seed-Vorgang abgeschlossen.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fehler beim Kategorie-Seed-Vorgang:", error);
    process.exit(1);
  });
