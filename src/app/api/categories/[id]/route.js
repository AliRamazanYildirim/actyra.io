let categories = [
  { _id: '1', name: 'Musik', icon: '🎵', createdAt: new Date().toISOString() },
  { _id: '2', name: 'Kunst', icon: '🎨', createdAt: new Date().toISOString() },
];

// GET /api/categories/:id
export async function GET(_req, { params }) {
  const category = categories.find((c) => c._id === params.id);
  if (!category) return new Response('Nicht gefunden', { status: 404 });
  return Response.json(category);
}

// PUT /api/categories/:id
export async function PUT(req, { params }) {
  const body = await req.json();
  const index = categories.findIndex((c) => c._id === params.id);
  if (index === -1) return new Response('Nicht gefunden', { status: 404 });
  categories[index] = { ...categories[index], ...body };
  return Response.json(categories[index]);
}

// DELETE /api/categories/:id
export async function DELETE(_req, { params }) {
  const index = categories.findIndex((c) => c._id === params.id);
  if (index === -1) return new Response('Nicht gefunden', { status: 404 });
  categories.splice(index, 1);
  return new Response(null, { status: 204 });
}
