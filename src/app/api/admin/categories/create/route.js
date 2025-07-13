import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function POST(request) {
  await dbConnect();
  const { name, icon } = await request.json();
  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "Name ist erforderlich." },
      { status: 400 }
    );
  }
  try {
    const category = await Category.create({
      name: name.trim(),
      icon: icon || "",
      isActive: true,
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Speichern." },
      { status: 500 }
    );
  }
}
