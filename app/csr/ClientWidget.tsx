"use client";
import { useEffect, useState } from "react";

type DemoPayload = {
  ts: string;
  value: number;
};

export default function ClientWidget() {
  const [data, setData] = useState<DemoPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/demo", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const payload = await res.json();
        if (alive) {
          setData(payload);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading in browser…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error loading data</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Client-Side Data</h2>
      <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
