import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js 15 Rendering Modes Demo",
  description: "Comprehensive examples of SSG, SSR, CSR, and ISR rendering strategies in Next.js 15.",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav
          aria-label="Primary navigation"
          className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Next.js 15 Demo
              </Link>
              <div className="flex gap-4 md:gap-6">
                <Link
                  href="/ssg"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm md:text-base"
                >
                  SSG
                </Link>
                <Link
                  href="/ssr"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm md:text-base"
                >
                  SSR
                </Link>
                <Link
                  href="/csr"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm md:text-base"
                >
                  CSR
                </Link>
                <Link
                  href="/isr/example"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm md:text-base"
                >
                  ISR
                </Link>
                <Link
                  href="/news"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm md:text-base"
                >
                  News
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        {modal}
      </body>
    </html>
  );
}
