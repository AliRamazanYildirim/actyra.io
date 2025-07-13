import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Laden der Kategorien." },
      { status: 500 }
    );
  }
}
