import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden." },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { name, icon } = await request.json();
  try {
    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, icon },
      { new: true }
    );
    if (!category) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden." },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Speichern." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Löschen." },
      { status: 500 }
    );
  }
}
