export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const url = type
    ? `https://bored-api.appbrewery.com/filter?type=${type}`
    : 'https://bored-api.appbrewery.com/random';

  try {
    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}