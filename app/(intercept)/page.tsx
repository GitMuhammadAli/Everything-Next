import Link from 'next/link';

export default function InterceptHome() {
  return (
    <main style={{padding:20}}>
      <h1>(intercept) Home</h1>
      <p>
        Use the link below to navigate into <code>/news</code> from inside the
        <code>(intercept)</code> segment. Clicking a news item will be intercepted and rendered
        into the <code>@archive</code> slot.
      </p>
      <p>
        <Link href="/news">Go to News (from (intercept))</Link>
      </p>
      <p>
        Or compare with direct navigation: <Link href="/news">/news</Link> from outside this segment (e.g., your root / page)
      </p>
    </main>
  );
}
