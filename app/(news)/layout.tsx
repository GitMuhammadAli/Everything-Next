import type { ReactNode } from "react";
import Link from "next/link";

export default function NewsSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="border-b p-4 bg-white">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">News Section</h1>
          <nav className="flex gap-4 text-red-700">
            <Link href="/news">News Home</Link>
            <Link href="/">App Home</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto w-full p-4">{children}</main>
      <footer className="border-t p-4 text-center text-sm text-neutral-600">News Footer</footer>
    </div>
  );
}
