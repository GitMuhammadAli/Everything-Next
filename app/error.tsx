'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if desired
    console.error('App error boundary caught:', error)
  }, [error])

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong</h1>
        {error?.digest ? (
          <p style={{ color: '#6b7280', marginTop: 4 }}>Error ID: {error.digest}</p>
        ) : null}
        <p style={{ marginTop: 12, color: '#374151' }}>
          An unexpected error occurred while rendering this page.
        </p>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #111827',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
