export const revalidate = 60;

type ISRPayload = {
  slug: string;
  updatedAt: string;
  note: string;
};

async function getPage(slug: string): Promise<ISRPayload> {
  return {
    slug,
    updatedAt: new Date().toISOString(),
    note: "Static shell; regenerates in background after revalidate window.",
  };
}

type ISRPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ISRPage({ params }: ISRPageProps) {
  const { slug } = await params;
  const data = await getPage(slug);
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">ISR — Incremental Static Regeneration</h1>
        <p className="text-gray-600 mb-6">
          This page is static but will re-generate in the background every {revalidate} seconds.
          ISR combines the benefits of static generation with the ability to update content without
          rebuilding the entire site.
        </p>

        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Page Data</h2>
          <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>How it works:</strong> The first request after the revalidation period will
            serve the cached page and trigger a background regeneration. Subsequent requests will
            receive the updated page.
          </p>
        </div>
      </div>
    </section>
  );
}
