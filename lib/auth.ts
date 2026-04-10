import { createClient } from '@/lib/supabase/client'
import { collectDeviceInfo } from '@/lib/device-fingerprint'

export interface User {
  id: string
  username: string
  role: 'admin' | 'technician'
}

export interface LoginLog {
  id: string
  user_id: string
  username: string
  role: string
  ip_address: string | null
  user_agent: string | null
  browser_name: string | null
  browser_version: string | null
  os_name: string | null
  os_version: string | null
  device_type: string | null
  device_name: string | null
  screen_resolution: string | null
  language: string | null
  connection_type: string | null
  network_type: string | null
  platform: string | null
  cpu_cores: number | null
  memory_mb: number | null
  touch_support: boolean | null
  timezone: string | null
  login_at: string
  logout_at: string | null
  is_active: boolean
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

/**
 * Force logout any other active sessions for this user
 */
async function forceLogoutOtherSessions(userId: string) {
  try {
    const supabase = createClient()
    await supabase
      .from('login_logs')
      .update({ logout_at: new Date().toISOString(), is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)
  } catch (error) {
    console.error('Error forcing logout other sessions:', error)
  }
}

/**
 * Record a login in the logs
 */
async function recordLogin(user: User) {
  try {
    const supabase = createClient()
    // First, mark any existing active sessions for this user as logged out
    await forceLogoutOtherSessions(user.id)

    // Collect device information
    const deviceInfo = await collectDeviceInfo()

    await supabase
      .from('login_logs')
      .insert({
        user_id: user.id,
        username: user.username,
        role: user.role,
        ip_address: deviceInfo.ipAddress,
        user_agent: deviceInfo.userAgent,
        browser_name: deviceInfo.browserName,
        browser_version: deviceInfo.browserVersion,
        os_name: deviceInfo.osName,
        os_version: deviceInfo.osVersion,
        device_type: deviceInfo.deviceType,
        device_name: deviceInfo.deviceName,
        screen_resolution: deviceInfo.screenResolution,
        language: deviceInfo.language,
        connection_type: deviceInfo.connectionType,
        network_type: deviceInfo.networkType,
        platform: deviceInfo.platform,
        cpu_cores: deviceInfo.cpuCores,
        memory_mb: deviceInfo.memory,
        touch_support: deviceInfo.touchSupport,
        timezone: deviceInfo.timezone,
        login_at: new Date().toISOString(),
        is_active: true
      })
  } catch (error) {
    console.error('Error recording login:', error)
  }
}

/**
 * Record a logout in the logs
 */
export async function recordLogout(userId: string) {
  try {
    const supabase = createClient()
    await supabase
      .from('login_logs')
      .update({ logout_at: new Date().toISOString(), is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)
  } catch (error) {
    console.error('Error recording logout:', error)
  }
}

export async function login(username: string, password: string): Promise<User | null> {
  try {
    // Check hardcoded credentials FIRST (works even without database)
    if (username === 'admin' && password === 'admin123') {
      const user: User = { id: '1', username: 'admin', role: 'admin' }
      await recordLogin(user)
      return user
    }
    if (username === 'technician' && password === 'technician123') {
      const user: User = { id: '2', username: 'technician', role: 'technician' }
      await recordLogin(user)
      return user
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
      const loggedInUser = {
        id: user.id,
        username: user.username,
        role: user.role
      }
      await recordLogin(loggedInUser)
      return loggedInUser
    }

    return null
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function logout(userId: string) {
  await recordLogout(userId)
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
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      if (error.message && error.message.includes('relation')) {
        console.error('The users table does not exist. Run database/schema.sql in Supabase SQL Editor.')
      }
      return []
    }

    return data || []
  } catch (error: any) {
    console.error('Error fetching users:', error)
    console.error('Error stack:', error?.stack)
    
    if (error?.message?.includes('fetch')) {
      console.error('Cannot connect to Supabase. Check internet connection and .env.local settings.')
    } else if (error?.message?.includes('relation')) {
      console.error('The users table does not exist. Run database/schema.sql in Supabase SQL Editor.')
    }
    return []
  }
}

export async function createUser(username: string, password: string, role: 'admin' | 'technician'): Promise<boolean> {
  try {
    const supabase = createClient()
    const hashedPassword = await hashPassword(password)

    console.log('Creating user:', { username, role, hashedPasswordLength: hashedPassword.length })

    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: hashedPassword,
        role
      })
      .select('id, username, role')

    if (error) {
      console.error('Error creating user:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Failed to create user: '
      if (error.code === '23505') {
        errorMessage += 'Username already exists.'
      } else if (error.message && error.message.includes('relation')) {
        errorMessage += 'Users table not found. Run database/schema.sql in Supabase SQL Editor.'
      } else if (error.message) {
        errorMessage += error.message
      } else if (Object.keys(error).length === 0) {
        errorMessage = 'Database request failed. This is usually a connection or permissions issue.'
        console.warn('⚠️ Empty error object usually means:')
        console.warn('  1. RLS policy is blocking the insert')
        console.warn('  2. Supabase anon key is invalid')
        console.warn('  3. Network issue to Supabase')
        console.warn('')
        console.warn('🔧 To fix:')
        console.warn('  - Run this in Supabase SQL Editor:')
        console.warn('    CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);')
        console.warn('  - Restart your dev server: npm run dev')
      }
      
      alert(errorMessage)
      return false
    }

    console.log('User created successfully:', data)
    return true
  } catch (error: any) {
    console.error('Error creating user:', error)
    console.error('Error stack:', error?.stack)
    
    let errorMessage = 'Failed to create user: '
    if (error?.message?.includes('fetch')) {
      errorMessage += 'Cannot connect to Supabase. Check your internet connection and .env.local settings.'
    } else if (error?.message?.includes('relation')) {
      errorMessage += 'The users table does not exist. Please run the database/schema.sql file in your Supabase SQL Editor.'
    } else if (error?.message) {
      errorMessage += error.message
    } else {
      errorMessage += 'Database connection error. Check console for details.'
    }
    
    alert(errorMessage)
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

export async function getLoginLogs(): Promise<LoginLog[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('login_logs')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('Error fetching login logs:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching login logs:', error)
    return []
  }
}

export async function deleteLoginLog(logId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('login_logs')
      .delete()
      .eq('id', logId)

    if (error) {
      console.error('Error deleting login log:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting login log:', error)
    return false
  }
}

export async function clearAllLoginLogs(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase.rpc('clear_login_logs')

    if (error) {
      // Fallback: use raw SQL via REST API
      const { error: fallbackError } = await supabase
        .from('login_logs')
        .delete()
        .gte('id', '00000000-0000-0000-0000-000000000000')

      if (fallbackError) {
        console.error('Error clearing login logs:', fallbackError)
        return false
      }
      return true
    }

    return true
  } catch (error) {
    console.error('Error clearing login logs:', error)
    return false
  }
}
