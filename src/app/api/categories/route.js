let categories = [
    { _id: '1', name: 'Musik', icon: '🎵', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Kunst', icon: '🎨', createdAt: new Date().toISOString() },
  ];
  
  export async function GET() {
    return Response.json(categories);
  }
  
  export async function POST(req) {
    const body = await req.json();
    if (!body.name) return new Response('Name erforderlich', { status: 400 });
    const newCategory = {
      _id: Date.now().toString(),
      name: body.name,
      icon: body.icon || '',
      createdAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    return Response.json(newCategory);
  }
  