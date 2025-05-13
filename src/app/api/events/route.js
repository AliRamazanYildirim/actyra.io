import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET: Gibt alle Events zurück (sortiert nach Datum)
export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({}).sort({ date: 1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fehler beim Abrufen der Events:', error);
    return NextResponse.json({ error: 'Beim Abrufen der Events ist ein Fehler aufgetreten.' }, { status: 500 });
  }
}

// POST: Erstellt ein neues Event mit Bild-Upload
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Debug için form alanlarını log'a yazdır
    console.log("Alınan form alanları:", [...formData.keys()]);
    
    // FormData'dan değerleri al
    const title = formData.get('title');
    const location = formData.get('location');
    const date = formData.get('date');
    const price = Number(formData.get('price'));
    const description = formData.get('description');
    const category = formData.get('category');
    const tickets = Number(formData.get('tickets'));
    const donation = Number(formData.get('donation'));
    
    // Debug için resim varlığını kontrol et
    const image = formData.get('image');
    console.log("Resim alındı mı:", image ? "Evet" : "Hayır");
    if (image) {
      console.log("Resim tipi:", image.type);
      console.log("Resim boyutu:", image.size);
    }
    
    // Slug oluştur
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Diğer alanlar
    const tags = category ? [category] : [];
    const shortDescription = description;
    const longDescription = description;
    
    // Resim işleme
    let imageUrl = '';
    
    if (image && image.size > 0) {
      // uploads klasörü oluştur (yoksa)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      console.log("Upload dizini:", uploadDir);
      
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log("Klasör oluşturuldu veya zaten var");
      } catch (error) {
        console.error("Klasör oluşturma hatası:", error);
      }
      
      // Resmi kaydet
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueFilename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      console.log("Dosya kaydediliyor:", filePath);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${uniqueFilename}`;
      console.log("Resim URL'si:", imageUrl);
    }
    
    await dbConnect();
    
    // Slug kontrolü
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json({ error: 'Bu isimde bir etkinlik zaten mevcut.' }, { status: 400 });
    }
    
    // Event oluştur
    const newEvent = await Event.create({
      title,
      location,
      date,
      price,
      imageUrl,  // Resim URL'si burada kaydedilir
      slug,
      tags,
      shortDescription,
      longDescription,
      tickets
    });
    
    console.log("Oluşturulan event:", newEvent);
    
    return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
  } catch (error) {
    console.error('Event oluşturma hatası:', error);
    return NextResponse.json({ error: 'Event oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}