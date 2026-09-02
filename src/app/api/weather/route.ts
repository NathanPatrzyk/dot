export async function GET(request: Request) {
  if (process.env.OPENWEATHER_ENABLED !== "true") {
    return new Response(null, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const baseUrl = process.env.OPENWEATHER_BASE_URL;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: "Erro ao buscar dados do clima" }),
      {
        status: res.status,
      },
    );
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
