import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: Alle Events (optional nach Kategorie)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    let query = {};
    if (category) query.category = category;
    const events = await Event.find(query).sort({ date: 1 }).lean();
    const result = events.map(e => ({ ...e, _id: e._id.toString() }));
    return NextResponse.json({ events: result });
  } catch (e) {
    return NextResponse.json({ error: "Fehler beim Laden der Events." }, { status: 500 });
  }
}

// POST: Neues Event (mit optionalem Bild)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const location = formData.get("location");
    const date = formData.get("date");
    if (!title || !location || !date) return NextResponse.json({ error: "Titel, Ort und Datum sind erforderlich" }, { status: 400 });
    const price = Number(formData.get("price") || 0);
    const category = formData.get("category") || "";
    const description = formData.get("description") || "";
    const tickets = Number(formData.get("tickets") || 0);
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    let imageUrl = "/images/event-default.webp";
    const image = formData.get("image");
    if (image && image.size > 0 && image.name !== "undefined") {
      const uploadDir = path.join(process.cwd(), "public", "images");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await image.arrayBuffer());
      const uniqueFilename = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      await writeFile(path.join(uploadDir, uniqueFilename), buffer);
      imageUrl = `/images/${uniqueFilename}`;
    }
    await dbConnect();
    const exists = await Event.findOne({ slug });
    if (exists) return NextResponse.json({ error: "Event existiert bereits." }, { status: 400 });
    const newEvent = await Event.create({
      title,
      location,
      date: new Date(date),
      price,
      imageUrl,
      slug,
      tags: category ? [category] : [],
      category,
      shortDescription: description,
      longDescription: description,
      tickets,
    });
    return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Fehler beim Erstellen des Events." }, { status: 500 });
  }
}
