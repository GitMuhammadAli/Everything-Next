import ClientWidget from "./ClientWidget";

export default function CSRPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">CSR — Client-Side Rendering</h1>
      <p>Shell is static; data loads in the browser after hydration.</p>
      <ClientWidget />
    </section>
  );
}
