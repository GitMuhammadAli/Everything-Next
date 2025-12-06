import Link from "next/link";

const links = [
  { href: "/ssg", label: "Static Site Generation (SSG)", description: "Pre-rendered at build time" },
  { href: "/ssr", label: "Server-Side Rendering (SSR)", description: "Rendered on each request" },
  { href: "/csr", label: "Client-Side Rendering (CSR)", description: "Rendered in the browser" },
  { href: "/isr/example", label: "Incremental Static Regeneration (ISR)", description: "Static with background updates" },
  { href: "/news", label: "News", description: "Database-driven articles" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Next.js 15 Rendering Modes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore how each rendering strategy works in Next.js 15's App Router. Learn the
          differences between SSG, SSR, CSR, and ISR with practical examples.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {link.label}
            </h2>
            <p className="text-gray-600 text-sm">{link.description}</p>
            <span className="inline-flex items-center mt-4 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Quick Navigation</h3>
        <p className="text-blue-800 text-sm">
          Use the navigation bar at the top for quick access to all pages. Each page demonstrates a
          different rendering strategy with real examples.
        </p>
      </div>
    </div>
  );
}

