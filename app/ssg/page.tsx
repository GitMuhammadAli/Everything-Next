async function getData() {
  const data = { builtAt: new Date().toISOString(), note: "Static at build" };
  return data;
}

export default async function SSGPage() {
  const data = await getData();
  return (
    <section>
      <h1 className="text-2xl font-bold">SSG — Static Site Generation</h1>
      <p>Built once during build. No server hit per request.</p>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
