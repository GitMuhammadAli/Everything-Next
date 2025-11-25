import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>404 - Page not found</h1>
        <p style={{ marginTop: 12, color: '#374151' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link
            href="/"
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
