import { NextResponse } from "next/server";
import categories from "@/data/categories";

// Dummy-Datenbank (im Speicher, nur Demo)
let extraCategories = [];

export async function GET(request, { params }) {
  const { id } = params;
  // In den festen Kategorien suchen
  let category = categories.find((cat) => cat.name === id);
  // In den zusätzlichen Kategorien suchen
  if (!category) {
    category = extraCategories.find((cat) => cat.id === id);
  }
  if (!category) {
    return NextResponse.json(
      { error: "Kategorie nicht gefunden." },
      { status: 404 }
    );
  }
  return NextResponse.json(category);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  // Nur zusätzliche Kategorien können aktualisiert werden
  const index = extraCategories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: "Nur benutzerdefinierte Kategorien können bearbeitet werden." },
      { status: 400 }
    );
  }
  extraCategories[index] = { ...extraCategories[index], ...body };
  return NextResponse.json(extraCategories[index]);
}

export async function POST(request) {
  const body = await request.json();
  // ID generieren
  const id = Math.random().toString(36).substr(2, 16);
  const newCategory = { id, ...body };
  extraCategories.push(newCategory);
  return NextResponse.json(newCategory);
}
