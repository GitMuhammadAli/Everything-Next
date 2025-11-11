export const metadata = { title: "Rendering Modes Demo" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans p-8 space-y-6">
        <nav className="space-x-4 underline">
          <a href="/ssg">SSG</a>
          <a href="/ssr">SSR</a>
          <a href="/csr">CSR</a>
          <a href="/isr/example-slug">ISR</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
