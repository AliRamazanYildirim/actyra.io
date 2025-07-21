import { NextResponse } from "next/server";
import categories from "@/data/categories";

// Gibt alle Kategorien als Array zurück
export async function GET() {
  return NextResponse.json({ categories });
}
