// Gibt die Anzahl der abgeschlossenen Events aus einer Event-Liste zurück
export function getCompletedEventsCount(events) {
  if (!Array.isArray(events)) return 0;
  return events.filter(e => e.status === "completed").length;
}


// Async-Variante für direkte DB-Query (z.B. im API-Route)
import Event from "@/models/Event";
export async function getCompletedEventsCountFromDb(filter = {}) {
  return await Event.countDocuments({ ...filter, status: "completed" });
}
