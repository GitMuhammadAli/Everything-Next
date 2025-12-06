import ClientWidget from "./ClientWidget";

export default function CSRPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">CSR — Client-Side Rendering</h1>
        <p className="text-gray-600 mb-6">
          Shell is static; data loads in the browser after hydration. The initial HTML is
          pre-rendered, but the data is fetched and rendered on the client side using React hooks.
        </p>
        <ClientWidget />
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Check the browser's Network tab to see the API call happening
            after the page loads.
          </p>
        </div>
      </div>
    </section>
  );
}
