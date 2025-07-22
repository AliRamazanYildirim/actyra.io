import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user is admin or veranstalter
    const user = await User.findOne({ clerkId: userId });
    if (!user || !["admin", "veranstalter"].includes(user.role)) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Build filter object
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    // Get events with pagination
    const skip = (page - 1) * limit;
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / limit);

    return NextResponse.json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// POST: Neues Event erstellen (Admin)
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user is admin or veranstalter
    const user = await User.findOne({ clerkId: userId });
    if (!user || !["admin", "veranstalter"].includes(user.role)) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Form-Daten extrahieren
    const title = formData.get("title");
    const location = formData.get("location");
    const date = formData.get("date");
    const price = Number(formData.get("price") || 0);
    const category = formData.get("category");
    const status = formData.get("status") || "active";
    const shortDescription = formData.get("shortDescription") || "";
    const longDescription = formData.get("longDescription") || "";
    const tagsJson = formData.get("tags");
    const image = formData.get("image");

    // Validierung
    if (!title || !location || !date || !category) {
      return NextResponse.json(
        { error: "Titel, Ort, Datum und Kategorie sind erforderlich" },
        { status: 400 }
      );
    }

    // Tags verarbeiten
    let tags = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch {
        tags = tagsJson
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
    }

    // Slug generieren
    let slug = title
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const replacements = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
        return replacements[match] || match;
      })
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .substring(0, 50);

    // Slug-Duplikat-Check
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
      console.log(`Slug "${slug}" bereits vorhanden, verwende "${slug}"`);
    }

    // Bild verarbeiten
    let imageUrl = "/images/event-default.webp";

    if (image && image.size > 0 && image.name !== "undefined") {
      try {
        // Cloudinary upload
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${image.type};base64,${base64}`;

        const cloudinary = (await import("@/lib/cloudinary")).default;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "events",
          public_id: `${Date.now()}-${image.name.replace(/\s+/g, "-")}`,
        });
        imageUrl = uploadResult.secure_url;
        console.log(`Bild zu Cloudinary hochgeladen: ${imageUrl}`);
      } catch (error) {
        console.error("Fehler beim Cloudinary Upload:", error);
        // Fallback auf default image, aber Event trotzdem erstellen
      }
    }

    // Event erstellen
    const newEvent = await Event.create({
      title,
      location,
      date,
      price,
      imageUrl,
      slug,
      tags,
      category,
      status,
      shortDescription,
      longDescription,
    });

    console.log(`Neues Event erstellt: ${newEvent.title} (${newEvent._id})`);

    return NextResponse.json(
      {
        event: {
          ...newEvent.toObject(),
          _id: newEvent._id.toString(),
        },
        message: "Event erfolgreich erstellt",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fehler beim Erstellen des Events:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Ein Event mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Event konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
