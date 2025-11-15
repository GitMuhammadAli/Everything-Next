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
  params: {
    slug: string;
  };
};

export default async function ISRPage({ params }: ISRPageProps) {
  const data = await getPage(params.slug);
  return (
    <section>
      <h1 className="text-2xl font-bold">ISR — Incremental Static Regeneration</h1>
      <p>This page is static but will re-generate in the background every {revalidate} seconds.</p>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
