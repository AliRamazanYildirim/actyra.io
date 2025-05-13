import dbConnect from '../db';
import Event from '../../models/Event';
import eventsData from '../../data/events';

async function seedEventsIfEmpty() {
  console.log('📡 Verbindung zur Datenbank wird hergestellt...');
  await dbConnect();

  const eventCount = await Event.countDocuments();

  if (eventCount > 0) {
    console.log(`ℹ️ Die Datenbank enthält bereits ${eventCount} Events. Seed wird übersprungen.`);
    return;
  }

  console.log('🌱 Keine Events gefunden. Seed-Daten werden eingefügt...');
  const inserted = await Event.insertMany(eventsData);
  console.log(`✅ ${inserted.length} Events wurden erfolgreich hinzugefügt.`);
}

// Nur automatisch ausführen, wenn Skript direkt aufgerufen wird
if (require.main === module) {
  seedEventsIfEmpty()
    .then(() => {
      console.log('🚀 Seed-Vorgang abgeschlossen.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fehler beim Seed-Vorgang:', error);
      process.exit(1);
    });
}
