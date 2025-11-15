import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DemoPayload = {
  ts: string;
  value: number;
};

function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getServerFresh(): Promise<DemoPayload> {
  const res = await fetch(`${resolveBaseUrl()}/api/demo`, { cache: "no-store" });
  if (!res.ok) throw new Error("Upstream failed");
  return res.json();
}

export default async function SSRPage() {
  const h = headers();
  const sess = cookies().get("session")?.value ?? "(none)";
  const payload = await getServerFresh();

  return (
    <section>
      <h1 className="text-2xl font-bold">SSR — Server-Side Rendering</h1>
      <p>Rendered on the server each request. Always fresh.</p>
      <p className="text-sm opacity-70">UA: {h.get("user-agent")} | session: {sess}</p>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(payload, null, 2)}</pre>
    </section>
  );
}
