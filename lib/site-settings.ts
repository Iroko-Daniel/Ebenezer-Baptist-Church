import { createClient } from '@/lib/supabase/client'

export interface SiteSettings {
  church_name: string
  church_tagline: string
  church_address: string
  church_phone: string
  church_email: string
  founded_year: string
  church_motto: string
  logo_url: string
  service_times: string
  wednesday_service: string
  friday_service: string
  stat_community: string
  stat_active_members: string
  stat_years: string
  facebook_url: string
  twitter_url: string
  youtube_url: string
  instagram_url: string
}

// Default settings as fallback
const DEFAULT_SETTINGS: SiteSettings = {
  church_name: 'Ebenezer Baptist Church',
  church_tagline: 'A Place of Worship and Community',
  church_address: '50A Campbell Street, Lagos Island, Lagos',
  church_phone: '+234 802 345 6789',
  church_email: 'info@ebenezerbaptist.org',
  founded_year: '1888',
  church_motto: '...led by the Spirit of God',
  logo_url: '/logo.png',
  service_times: 'Sunday School: 9:00 AM | Main Service: 10:00 AM',
  wednesday_service: 'Wednesday Bible Study: 6:00 PM',
  friday_service: 'Friday Prayer Meeting: 7:00 PM',
  stat_community: '300+',
  stat_active_members: '359+',
  stat_years: '138+',
  facebook_url: '',
  twitter_url: '',
  youtube_url: '',
  instagram_url: ''
}

let cachedSettings: SiteSettings | null = null
let lastFetch: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch site settings from database with caching
 */
export async function getSiteSettings(forceRefresh = false): Promise<SiteSettings> {
  const now = Date.now()
  
  // Return cached settings if still valid
  if (!forceRefresh && cachedSettings && (now - lastFetch) < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('site_settings').select('setting_key, setting_value')
    
    if (error || !data || data.length === 0) {
      console.warn('Failed to fetch site settings, using defaults:', error?.message)
      cachedSettings = DEFAULT_SETTINGS
      lastFetch = now
      return DEFAULT_SETTINGS
    }

    // Convert array to object
    const settings: any = {}
    data.forEach(item => {
      settings[item.setting_key] = item.setting_value || ''
    })

    // Merge with defaults for any missing keys
    cachedSettings = { ...DEFAULT_SETTINGS, ...settings }
    lastFetch = now
    
    return cachedSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return cachedSettings || DEFAULT_SETTINGS
  }
}

/**
 * Clear cached settings (useful after updates)
 */
export function clearSettingsCache() {
  cachedSettings = null
  lastFetch = 0
}
