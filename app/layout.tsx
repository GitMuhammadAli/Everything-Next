import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from 'next/link'
import "./globals.css";

export const metadata: Metadata = {
  title: "Rendering Modes Demo",
  description: "Side-by-side examples of the major Next.js rendering paradigms.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="p-8 space-y-6">
        <nav aria-label="Primary navigation" className="mb-8">
          <div className="flex gap-6 text-red-600">
            <Link href="/ssg" className="hover:text-red-800">SSG</Link>
            <Link href="/ssr" className="hover:text-red-800">SSR</Link>
            <Link href="/csr" className="hover:text-red-800">CSR</Link>
            <Link href="/isr/example" className="hover:text-red-800">ISR</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
