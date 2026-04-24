/**
 * Supabase Connection Test
 * Run this to verify your connection to Supabase
 */

const SUPABASE_URL = 'https://fyzqywrqfzqkhipwoxpc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5enF5d3Jmd3F6a2hpcHdveHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDgwMDgsImV4cCI6MjA5MTIyNDAwOH0.H000NyUn5O-q8kqhoPj_sJUD3o3VweOXRfdKrHqZXak'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...')
  console.log('URL:', SUPABASE_URL)
  
  try {
    // Test 1: Basic HTTP connection
    console.log('\n📡 Test 1: Basic HTTP Connection')
    const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
    
    if (healthCheck.ok) {
      console.log('✅ HTTP Connection successful')
      console.log('Status:', healthCheck.status)
    } else {
      console.log('❌ HTTP Connection failed')
      console.log('Status:', healthCheck.status)
      console.log('Response:', await healthCheck.text())
    }

    // Test 2: Try to query users table
    console.log('\n👥 Test 2: Query Users Table')
    const usersQuery = await fetch(`${SUPABASE_URL}/rest/v1/users?limit=5`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (usersQuery.ok) {
      const users = await usersQuery.json()
      console.log('✅ Users table accessible')
      console.log('Found', users.length, 'users')
      if (users.length > 0) {
        console.log('Users:', users.map(u => u.username).join(', '))
      } else {
        console.log('⚠️  Users table is empty - run the schema.sql file!')
      }
    } else {
      const errorText = await usersQuery.text()
      console.log('❌ Users table query failed')
      console.log('Status:', usersQuery.status)
      console.log('Error:', errorText)
      
      if (errorText.includes('relation') || errorText.includes('does not exist')) {
        console.log('\n💡 SOLUTION: The users table does not exist.')
        console.log('   Run the database/schema.sql file in your Supabase SQL Editor.')
      }
    }

    // Test 3: Try to query site_settings table
    console.log('\n⚙️  Test 3: Query Site Settings Table')
    const settingsQuery = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (settingsQuery.ok) {
      const settings = await settingsQuery.json()
      console.log('✅ Site settings table accessible')
      console.log('Found', settings.length, 'settings')
    } else {
      const errorText = await settingsQuery.text()
      console.log('❌ Site settings table query failed')
      console.log('Status:', settingsQuery.status)
      
      if (errorText.includes('relation') || errorText.includes('does not exist')) {
        console.log('\n💡 SOLUTION: The site_settings table does not exist.')
        console.log('   Run the database/schema.sql file in your Supabase SQL Editor.')
      }
    }

    // Test 4: Check if storage bucket exists
    console.log('\n📦 Test 4: Check Storage Bucket')
    const storageQuery = await fetch(`${SUPABASE_URL}/storage/v1/bucket/gallery`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    if (storageQuery.ok) {
      console.log('✅ Gallery storage bucket exists')
    } else {
      console.log('⚠️  Gallery storage bucket not found')
      console.log('   Create it in Storage → New bucket → name: "gallery" → Public: ON')
    }

    console.log('\n✨ Connection test complete!')
    console.log('Check the messages above for any issues.')

  } catch (error) {
    console.error('❌ Connection test failed with error:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    console.log('\n💡 Possible issues:')
    console.log('   1. No internet connection')
    console.log('   2. Supabase project is paused')
    console.log('   3. Invalid API keys')
    console.log('   4. CORS issues (check browser console)')
  }
}

// Run the test
testSupabaseConnection()
