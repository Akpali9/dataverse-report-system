// app/test-db/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function test() {
      try {
        const response = await fetch('/api/debug')
        const data = await response.json()
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }
    test()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          Error: {error}
        </div>
      )}
      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
