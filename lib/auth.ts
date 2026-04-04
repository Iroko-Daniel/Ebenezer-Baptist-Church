import { createClient } from '@/lib/supabase/client'

export interface User {
  id: string
  username: string
  role: 'admin' | 'technician'
}

// Simple hash function for client-side password checking
// Note: This is NOT secure for production - use Supabase Auth in production
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function login(username: string, password: string): Promise<User | null> {
  try {
    // Check hardcoded credentials FIRST (works even without database)
    if (username === 'admin' && password === 'admin123') {
      return { id: '1', username: 'admin', role: 'admin' }
    }
    if (username === 'technician' && password === 'technician123') {
      return { id: '2', username: 'technician', role: 'technician' }
    }

    const supabase = createClient()

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return null
    }

    // Check password against hashed password in DB
    const hashedPassword = await hashPassword(password)
    if (hashedPassword === user.password_hash) {
      return {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }

    return null
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function createUser(username: string, password: string, role: 'admin' | 'technician'): Promise<boolean> {
  try {
    const supabase = createClient()
    const hashedPassword = await hashPassword(password)
    
    const { error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: hashedPassword,
        role
      })

    if (error) {
      console.error('Error creating user:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating user:', error)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Error deleting user:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}
