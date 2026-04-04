// Database types for Supabase
export interface Sermon {
  id: string
  title: string
  preacher: string
  bible_text: string
  date: string
  image_url: string
  content: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  date: string
  description: string
  location: string
  image_url: string
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: 'normal' | 'high' | 'urgent'
  date: string
  created_at: string
}

export interface GalleryImage {
  id: string
  url: string
  title: string
  created_at: string
}

export interface Enquiry {
  id: string
  type: string
  first_name: string
  last_name: string
  phone: string
  gender?: string
  address?: string
  is_member?: string
  body?: string
  prayer_request?: string
  created_at: string
}

export interface Branch {
  id: string
  name: string
  address: string
  city: string
}

export interface Executive {
  id: string
  name: string
  title: string
  image_url?: string
}

export interface Livestream {
  id: string
  youtube_url: string
  is_active: boolean
}
