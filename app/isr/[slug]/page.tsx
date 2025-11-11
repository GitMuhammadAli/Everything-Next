export const revalidate = 60;

async function getPage(slug) {
  const data = {
    slug,
    updatedAt: new Date().toISOString(),
    note: "Static shell; regenerates in background after revalidate window.",
  };
  return data;
}

export default async function ISRPage({ params }) {
  const data = await getPage(params.slug);
  return (
    <section>
      <h1 className="text-2xl font-bold">ISR — Incremental Static Regeneration</h1>
      <p>This page is static but will re-generate in the background every {revalidate} seconds.</p>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
