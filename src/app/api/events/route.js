import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET: Gibt alle Events zurück (mit optionalem Kategoriefilter)
export async function GET(request) {
  try {
    await dbConnect();

    // URL-Parameter abrufen (für eventuelle Filter)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Abfrageoptionen erstellen
    const query = {};
    
    // Nach Kategorie filtern, wenn angegeben
    if (category) {
      if (category === 'sonstige-events') {
        // Für "sonstige-events" spezielle Abfrage erstellen
        const validCategories = [
          "kultur-musik", "sport-freizeit", "bildung-workshop",
          "business-networking", "gesundheit", "technologie-innovation",
          "messen-ausstellungen"
        ];
        
        query.$or = [
          { category: { $nin: validCategories } },
          { category: { $exists: false } },
          { category: null },
          { category: "" }
        ];
      } else {
        // Für normale Kategorien
        query.category = category;
      }
    }
    
    // Events aus der Datenbank abrufen und nach Datum sortieren
    const events = await Event.find(query).sort({ date: 1 }).lean();
    
    // ObjectIds in Strings umwandeln für bessere JSON-Serialisierung
    const serializedEvents = events.map(event => ({
      ...event,
      _id: event._id.toString()
    }));
    
    // Debug-Informationen
    console.log(`${serializedEvents.length} Events gefunden${category ? ` für Kategorie "${category}"` : ''}`);
    
    return NextResponse.json(serializedEvents);
  } catch (error) {
    console.error('Fehler beim Abrufen der Events:', error);
    return NextResponse.json({ error: 'Beim Abrufen der Events ist ein Fehler aufgetreten.' }, { status: 500 });
  }
}

// POST: Erstellt ein neues Event mit Bild-Upload
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Debug: Form-Felder im Log ausgeben
    console.log("Erhaltene Form-Felder:", [...formData.keys()]);
    
    // Werte aus FormData extrahieren
    const title = formData.get('title');
    const location = formData.get('location');
    const date = formData.get('date');
    const price = Number(formData.get('price'));
    const description = formData.get('description');
    const category = formData.get('category');
    const tickets = Number(formData.get('tickets'));
    const donation = Number(formData.get('donation'));
    
    // Debug: Überprüfen, ob ein Bild vorhanden ist
    const image = formData.get('image');
    console.log("Bild erhalten:", image ? "Ja" : "Nein");
    if (image) {
      console.log("Bildtyp:", image.type);
      console.log("Bildgröße:", image.size);
    }
    
    // Slug erstellen
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Weitere Felder
    const tags = category ? [category] : [];
    const shortDescription = description;
    const longDescription = description;
    
    // Bildverarbeitung
    let imageUrl = '';
    
    if (image && image.size > 0) {
      // Upload-Ordner erstellen (falls nicht vorhanden)
      const uploadDir = path.join(process.cwd(), 'public', 'images');
      console.log("Upload-Verzeichnis:", uploadDir);
      
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log("Ordner erstellt oder bereits vorhanden");
      } catch (error) {
        console.error("Fehler beim Erstellen des Ordners:", error);
      }
      
      // Bild speichern
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueFilename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      console.log("Datei wird gespeichert:", filePath);
      
      await writeFile(filePath, buffer);
      imageUrl = `/images/${uniqueFilename}`;
      console.log("Bild-URL:", imageUrl);
    }
    
    await dbConnect();
    
    // Slug-Überprüfung
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json({ error: 'Ein Event mit diesem Namen existiert bereits.' }, { status: 400 });
    }
    
    // Event erstellen
    const newEvent = await Event.create({
      title,
      location,
      date,
      price,
      imageUrl,  // Bild-URL wird hier gespeichert
      slug,
      tags,
      shortDescription,
      longDescription,
      tickets
    });
    
    console.log("Erstelltes Event:", newEvent);
    
    return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Events:', error);
    return NextResponse.json({ error: 'Beim Erstellen des Events ist ein Fehler aufgetreten.' }, { status: 500 });
  }
}

