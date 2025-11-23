export default function HomePage() {
  const links = [
    { href: "/ssg", label: "Static Site Generation (SSG)" },
    { href: "/ssr", label: "Server-Side Rendering (SSR)" },
    { href: "/csr", label: "Client-Side Rendering (CSR)" },
    { href: "/isr/example", label: "Incremental Static Regeneration (ISR)" },
    {href: "/news", label: "News"},
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Next.js Rendering Modes</h1>
      <p>
        Explore how each rendering strategy works in Next.js 14’s App Router. These examples intentionally stay
        lightweight so you can focus on the behavior differences rather than UI polish.
      </p>
      <ul className="space-y-2 list-disc pl-6">
        {links.map((link) => (
          <li key={link.href}>
            <a className="text-blue-600 hover:underline" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm opacity-75">Check the navigation bar above for quick access as well.</p>
    </section>
  );
}

