type StaticData = {
  builtAt: string;
  note: string;
};

async function getData(): Promise<StaticData> {
  return {
    builtAt: new Date().toISOString(),
    note: "Static at build - This page was generated at build time and served as a static file.",
  };
}

export default async function SSGPage() {
  const data = await getData();
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">SSG — Static Site Generation</h1>
        <p className="text-gray-600 mb-6">
          Built once during build time. No server hit per request. This page is pre-rendered at
          build time and served as a static HTML file, making it extremely fast.
        </p>

        <div className="bg-green-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Build Information</h2>
          <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> The timestamp above shows when this page was built. It won't
            change until you rebuild the application.
          </p>
        </div>
      </div>
    </section>
  );
}
