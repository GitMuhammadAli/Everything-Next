import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Marketing</h1>
          <nav className="flex gap-4 text-blue-700">
            <Link href="/">Home</Link>
            <Link href="/ssg">SSG</Link>
            <Link href="/ssr">SSR</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto w-full p-4 flex-1">{children}</main>
      <footer className="border-t p-4 text-center text-sm text-neutral-600">© {new Date().getFullYear()} Marketing</footer>
    </div>
  );
}
