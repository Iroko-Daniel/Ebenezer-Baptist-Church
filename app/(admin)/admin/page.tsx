'use client'

import { useState, useEffect } from 'react'
import { login } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import Notifications from '@/components/Notifications'

interface User { id: string; username: string; role: 'admin' | 'technician' }

const NAV_ITEMS = [
  { id: 'sermons', label: 'Sermons', emoji: '📖' },
  { id: 'events', label: 'Events', emoji: '📅' },
  { id: 'announcements', label: 'Announcements', emoji: '📢' },
  { id: 'gallery', label: 'Gallery', emoji: '🖼️' },
  { id: 'livestream', label: 'Livestream', emoji: '🎥' },
  { id: 'branches', label: 'Branches', emoji: '⛪' },
  { id: 'notifications', label: 'Enquiries', emoji: '📧' },
] as const

type TabId = typeof NAV_ITEMS[number]['id']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('sermons')
  const [user, setUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme')
    if (savedTheme === 'dark') setIsDark(true)
  }, [])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    const loggedInUser = await login(loginForm.username, loginForm.password)
    if (loggedInUser) {
      if (loggedInUser.role === 'technician') { setLoginError('Invalid username or password'); setLoading(false); return }
      setUser(loggedInUser)
      setShowGreeting(true)
      // Auto-hide greeting after 3 seconds
      setTimeout(() => setShowGreeting(false), 3000)
    } else { setLoginError('Invalid username or password') }
    setLoading(false)
  }

  // ───────────── LOGIN SCREEN ─────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#1a2d47] to-[#142840] flex items-center justify-center p-4">
        {/* Ambient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4">
              <span className="text-3xl">⛪</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">Ebenezer Baptist Church</h1>
            <p className="text-blue-300/70 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-1">Welcome Back 👋</h2>
              <p className="text-gray-400 text-sm mb-6">Sign in to manage church content</p>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span>⚠️</span> {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25"
                >
                  {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ───────────── DASHBOARD ─────────────
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-[#f0f2f5]'}`}>
      {/* Welcome Greeting Overlay */}
      {showGreeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce-in bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-8 rounded-3xl shadow-2xl text-center">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-lg text-white/90">Hello, {user?.username}!</p>
          </div>
        </div>
      )}
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className={`w-64 border-r flex flex-col shadow-sm flex-shrink-0 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Brand */}
        <div className={`p-5 border-b transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-xl">⛪</span>
            </div>
            <div>
              <h1 className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Content Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                    : isDark 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Admin Portal</p>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar with Theme Toggle */}
        <div className={`sticky top-0 z-10 px-6 py-3 border-b backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-[#f0f2f5]/95 border-gray-200'}`}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{NAV_ITEMS.find(t => t.id === activeTab)?.emoji}</span>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{NAV_ITEMS.find(t => t.id === activeTab)?.label}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Username Display */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}>
                <span>👤</span>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              
              {/* Theme Toggle Switch */}
              <button
                onClick={toggleTheme}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-400'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                    isDark ? 'left-9' : 'left-1'
                  }`}
                >
                  <span className="text-sm">
                    {isDark ? '🌙' : '☀️'}
                  </span>
                </div>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={() => setUser(null)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium shadow-sm"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto p-6 sm:p-8">
          {/* Content Card */}
          <div className={`rounded-2xl shadow-sm border p-6 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'sermons' && <SermonsManager isDark={isDark} />}
            {activeTab === 'events' && <EventsManager isDark={isDark} />}
            {activeTab === 'announcements' && <AnnouncementsManager isDark={isDark} />}
            {activeTab === 'gallery' && <GalleryManager isDark={isDark} />}
            {activeTab === 'livestream' && <LivestreamManager isDark={isDark} />}
            {activeTab === 'branches' && <BranchesManager isDark={isDark} />}
          </div>
        </div>
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// MANAGER COMPONENTS
// ═══════════════════════════════════════════════════

function DeleteButton({ onClick, deleting }: { onClick: () => void; deleting: boolean }) {
  return (
    <button onClick={onClick} disabled={deleting} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50" title="Delete">
      {deleting ? <span className="text-xs">⏳</span> : <span className="text-lg">🗑️</span>}
    </button>
  )
}

function SermonsManager() {
  const [form, setForm] = useState({ title: '', preacher: '', bibleText: '', date: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [sermons, setSermons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchSermons() }, [])
  const fetchSermons = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('sermons').select('*').order('date', { ascending: false })
    if (data) setSermons(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('sermons').insert([{ title: form.title, preacher: form.preacher, bible_text: form.bibleText, date: form.date, content: form.content }])
    if (!error) { alert('✅ Sermon saved!'); setForm({ title: '', preacher: '', bibleText: '', date: '', content: '' }); fetchSermons() }
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sermon?')) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('sermons').delete().eq('id', id)
    if (!error) setSermons(prev => prev.filter(s => s.id !== id))
    else alert('❌ Error: ' + error.message)
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>✨</span> Add New Sermon
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📝 Sermon Title" required />
            <input value={form.preacher} onChange={e => setForm({...form, preacher: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="👤 Preacher Name" required />
            <input value={form.bibleText} onChange={e => setForm({...form, bibleText: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📖 Bible Text" required />
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="📄 Sermon content..." required />
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Sermon'}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📚</span> All Sermons ({sermons.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading sermons...</p> : (
          <div className="space-y-2">
            {sermons.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No sermons yet. Add your first one above! ☝️</p>
            ) : (
              sermons.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">📖 {s.title}</p>
                    <p className="text-sm text-gray-500 mt-1">👤 {s.preacher} • 📅 {new Date(s.date).toLocaleDateString()}</p>
                  </div>
                  <DeleteButton onClick={() => handleDelete(s.id)} deleting={deleting === s.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EventsManager() {
  const [form, setForm] = useState({ title: '', date: '', description: '', location: '' })
  const [saving, setSaving] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchEvents() }, [])
  const fetchEvents = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('events').insert([{ ...form }])
    if (!error) { alert('✅ Event saved!'); setForm({ title: '', date: '', description: '', location: '' }); fetchEvents() }
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) setEvents(prev => prev.filter(ev => ev.id !== id))
    else alert('❌ Error: ' + error.message)
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add New Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📝 Event Title" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📍 Location" required />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2} placeholder="📄 Event description..." required />
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Event'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📆</span> All Events ({events.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading events...</p> : (
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No events yet. Add your first one above! ☝️</p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">📅 {ev.title}</p>
                    <p className="text-sm text-gray-500 mt-1">📅 {new Date(ev.date).toLocaleDateString()} • 📍 {ev.location}</p>
                  </div>
                  <DeleteButton onClick={() => handleDelete(ev.id)} deleting={deleting === ev.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AnnouncementsManager() {
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal' })
  const [saving, setSaving] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchAnnouncements() }, [])
  const fetchAnnouncements = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('announcements').select('*').order('date', { ascending: false })
    if (data) setAnnouncements(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase.from('announcements').insert([{ ...form, date: today }])
    if (!error) { alert('✅ Announcement saved!'); setForm({ title: '', content: '', priority: 'normal' }); fetchAnnouncements() }
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) setAnnouncements(prev => prev.filter(a => a.id !== id))
    else alert('❌ Error: ' + error.message)
    setDeleting(null)
  }

  const priorityBadge: any = {
    normal: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    high: 'bg-amber-100 text-amber-700 border-amber-200',
    urgent: 'bg-red-100 text-red-700 border-red-200',
  }
  const priorityEmoji: any = { normal: '🟢', high: '🟡', urgent: '🔴' }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📝 Announcement Title" required />
          <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="normal">🟢 Normal</option>
            <option value="high">🟡 High Priority</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="📄 Announcement content..." required />
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Announcement'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📋</span> All Announcements ({announcements.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading announcements...</p> : (
          <div className="space-y-2">
            {announcements.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No announcements yet. Add your first one above! ☝️</p>
            ) : (
              announcements.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{priorityEmoji[a.priority]}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${priorityBadge[a.priority]}`}>{a.priority}</span>
                      <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">📅 {new Date(a.date).toLocaleDateString()}</p>
                  </div>
                  <DeleteButton onClick={() => handleDelete(a.id)} deleting={deleting === a.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GalleryManager() {
  const [form, setForm] = useState({ title: '', category: 'General' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchImages() }, [])
  const fetchImages = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
    if (data) setImages(data)
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return alert('❌ Select an image')
    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `gallery/${fileName}`
      const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, selectedFile)
      if (uploadError) throw uploadError
      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
      const { error: dbError } = await supabase.from('gallery_images').insert({ title: form.title, url: publicUrlData.publicUrl, category: form.category })
      if (dbError) throw dbError
      alert('✅ Image uploaded!')
      setForm({ title: '', category: 'General' })
      setSelectedFile(null)
      setPreviewUrl(null)
      fetchImages()
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { setUploading(false) }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this image?')) return
    setDeleting(id)
    try {
      const supabase = createClient()
      const urlParts = imageUrl.split('/gallery/')
      if (urlParts.length > 1) await supabase.storage.from('gallery').remove([urlParts[1]])
      await supabase.from('gallery_images').delete().eq('id', id)
      setImages(prev => prev.filter(img => img.id !== id))
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { setDeleting(null) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Upload Image</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
            <span className="text-3xl block mb-2">📁</span>
            <p className="text-sm text-gray-600 font-medium">Click to upload an image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
          </label>
          {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg border border-gray-200" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder=" Image Title" required />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {['General','Worship','Fellowship','Outreach','Events','Youth'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
            {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>🖼️</span> Gallery ({images.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading images...</p> : (
          images.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No images yet. Upload your first one above! ☝️</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-3">
                    <p className="text-white text-sm font-medium truncate flex-1">{img.title}</p>
                    <button onClick={() => handleDelete(img.id, img.url)} disabled={deleting === img.id} className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50 flex-shrink-0 ml-2">
                      {deleting === img.id ? '⏳' : '✕'}
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">📂 {img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function LivestreamManager() {
  const [form, setForm] = useState({ youtubeUrl: '', isActive: false })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLivestream() }, [])
  const fetchLivestream = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('livestream').select('*').limit(1).maybeSingle()
    if (data) setForm({ youtubeUrl: data.youtube_url || '', isActive: data.is_active || false })
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: existing } = await supabase.from('livestream').select('id').limit(1).maybeSingle()
    let error = null
    if (existing) {
      const { error: updateErr } = await supabase.from('livestream').update({ youtube_url: form.youtubeUrl, is_active: form.isActive }).eq('id', existing.id)
      error = updateErr
    } else {
      const { error: insertErr } = await supabase.from('livestream').insert({ youtube_url: form.youtubeUrl, is_active: form.isActive })
      error = insertErr
    }
    if (!error) alert('✅ Updated!')
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  return (
    <div className="max-w-xl">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2"><span>🎥</span> Livestream Settings</h3>
        {loading ? <p className="text-gray-500 text-sm">Loading settings...</p> : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Stream URL</label>
              <input type="url" value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Stream is currently active</span>
            </label>
            {form.isActive && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-700 text-sm font-semibold">🔴 LIVE — Stream is broadcasting</span>
              </div>
            )}
            <button type="submit" disabled={saving} className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
              {saving ? '⏳ Saving...' : '💾 Update Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function BranchesManager() {
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '', serviceTimes: '' })
  const [saving, setSaving] = useState(false)
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchBranches() }, [])
  const fetchBranches = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('branches').select('*').order('name')
    if (data) setBranches(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('branches').insert([{ name: form.name, address: form.address, city: form.city, phone: form.phone, service_times: form.serviceTimes }])
    if (!error) { alert('✅ Branch saved!'); setForm({ name: '', address: '', city: '', phone: '', serviceTimes: '' }); fetchBranches() }
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('branches').delete().eq('id', id)
    if (!error) setBranches(prev => prev.filter(b => b.id !== id))
    else alert('❌ Error: ' + error.message)
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Branch</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="⛪ Branch Name" required />
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📍 Full Address" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="🏙️ City" required />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📞 Phone Number" />
          </div>
          <input value={form.serviceTimes} onChange={e => setForm({...form, serviceTimes: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="🕐 Service Times (e.g., Sunday 10:00 AM)" required />
          <button type="submit" disabled={saving} className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Branch'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>⛪</span> All Branches ({branches.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading branches...</p> : (
          <div className="space-y-3">
            {branches.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No branches yet. Add your first one above! ☝️</p>
            ) : (
              branches.map(b => (
                <div key={b.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-semibold text-gray-900">⛪ {b.name}</p>
                    <p className="text-sm text-gray-500 mt-1">🏙️ {b.city} • 📍 {b.address}</p>
                  </div>
                  <DeleteButton onClick={() => handleDelete(b.id)} deleting={deleting === b.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
