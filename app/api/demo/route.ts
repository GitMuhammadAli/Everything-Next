type DemoPayload = {
  ts: string;
  value: number;
};

export async function GET() {
  const payload: DemoPayload = { ts: new Date().toISOString(), value: Math.floor(Math.random() * 1000) };
  return Response.json(payload, { headers: { "Cache-Control": "no-store" } });
}
