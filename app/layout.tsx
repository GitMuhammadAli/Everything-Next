import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import AuthSessionProvider from "./auth/SessionProvider";
import AuthButtons from "./auth/AuthButtons";

export const metadata: Metadata = {
  title: "Rendering Modes Demo",
  description: "Side-by-side examples of the major Next.js rendering paradigms.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="p-8 space-y-6">
        <AuthSessionProvider>
          <nav className="space-x-4 underline">
            <a href="/ssg">SSG</a>
            <a href="/ssr">SSR</a>
            <a href="/csr">CSR</a>
            <a href="/isr/example">ISR</a>
            <span className="pl-4 no-underline">
              <AuthButtons />
            </span>
          </nav>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
