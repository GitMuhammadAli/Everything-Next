"use client";
import { useEffect, useState } from "react";

type DemoPayload = {
  ts: string;
  value: number;
};

export default function ClientWidget() {
  const [data, setData] = useState<DemoPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/demo", { cache: "no-store" });
      const payload = await res.json();
      if (alive) {
        setData(payload);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p>Loading in browser…</p>;
  return <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>;
}
