export async function GET() {
  const payload = { ts: new Date().toISOString(), value: Math.floor(Math.random() * 1000) };
  return Response.json(payload, { headers: { "Cache-Control": "no-store" } });
}
