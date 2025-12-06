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
  return "http://localhost:6600";
}

async function getServerFresh(): Promise<DemoPayload> {
  const baseUrl = resolveBaseUrl();
  const res = await fetch(`${baseUrl}/api/demo`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default async function SSRPage() {
  const h = await headers();
  const sess = (await cookies()).get("session")?.value ?? "(none)";
  const userAgent = h.get("user-agent") ?? "Unknown";
  const payload = await getServerFresh();

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">SSR — Server-Side Rendering</h1>
        <p className="text-gray-600 mb-6">
          Rendered on the server each request. Always fresh. This page is generated on every
          request, ensuring you always see the latest data.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Request Information</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">User Agent:</span>{" "}
              <span className="text-gray-600">{userAgent.substring(0, 80)}...</span>
            </p>
            <p>
              <span className="font-medium">Session:</span>{" "}
              <span className="text-gray-600">{sess}</span>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Fresh Data</h2>
          <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}
