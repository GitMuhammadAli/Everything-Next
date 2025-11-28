import Link from 'next/link';

const DUMMY_NEWS = [
  { id: 'ai-robot', title: 'AI Robot Advances' },
  { id: 'beaver', title: 'Beaver Builds Big' },
];

export default function NewsFromInterceptPage() {
  return (
    <main style={{padding:20}}>
      <h1>News listing (navigated from (intercept))</h1>
      <ul style={{ display: 'grid', gap: 8 }}>
        {DUMMY_NEWS.map((n) => (
          <li key={n.id}>
            {/* Normal link to /news/[id]. Interception route will catch this and render in @archive slot. */}
            <Link href={`/news/${n.id}`}>{n.title}</Link>
          </li>
        ))}
      </ul>
      <p style={{marginTop: 16}}>
        Compare with normal navigation via <Link href="/">root</Link> → <Link href="/news">/news</Link>
      </p>
    </main>
  );
}
