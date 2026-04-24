'use client'

import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
  const [result, setResult] = useState<string>('')
  const [envVars, setEnvVars] = useState<{ url: string; key: string }>({ url: '', key: '' })

  useEffect(() => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET',
    })

    async function testConnection() {
      const results: string[] = []
      
      // Test 1: Check environment variables
      results.push('🔍 Test 1: Environment Variables')
      results.push(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT SET'}`)
      results.push(`Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}`)
      results.push('')

      // Test 2: Direct fetch to Supabase REST API
      results.push('📡 Test 2: Direct fetch to Supabase')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      try {
        const response = await fetch(`${url}/rest/v1/users?limit=5`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
          },
        })
        results.push(`Status: ${response.status} ${response.ok ? '✅' : '❌'}`)
        
        if (response.ok) {
          const users = await response.json()
          results.push(`✅ Found ${users.length} users`)
          users.forEach((u: any) => {
            results.push(`  - ${u.username} (${u.role})`)
          })
        } else {
          const errorText = await response.text()
          results.push(`❌ Error: ${errorText}`)
        }
      } catch (error: any) {
        results.push(`❌ Fetch failed: ${error.message}`)
        results.push('')
        results.push('💡 This usually means:')
        results.push('  1. Your internet connection is blocked')
        results.push('  2. Firewall/antivirus is blocking Supabase')
        results.push('  3. DNS cannot resolve supabase.co')
        results.push('  4. You need to restart the dev server')
      }

      results.push('')
      results.push('✨ Test complete!')
      
      setResult(results.join('\n'))
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔌 Supabase Connection Test</h1>
        
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Environment Variables</h2>
          <pre className="text-sm text-gray-300">
            NEXT_PUBLIC_SUPABASE_URL: {envVars.url}
            {'\n'}
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.key}
          </pre>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Connection Test Results</h2>
          <pre className="text-sm text-green-400 whitespace-pre-wrap">{result || 'Testing...'}</pre>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">⚠️ If tests are failing:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-200">
            <li>Stop your dev server (Ctrl+C)</li>
            <li>Run: <code className="bg-gray-800 px-2 py-1 rounded">rmdir /s /q .next</code></li>
            <li>Run: <code className="bg-gray-800 px-2 py-1 rounded">npm run dev</code></li>
            <li>Refresh this page</li>
            <li>Check your internet connection</li>
            <li>Try disabling firewall/antivirus temporarily</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
