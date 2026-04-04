'use client'

import { useState, useEffect } from 'react'
import { login, getUsers, createUser, deleteUser, User } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import Notifications from '@/components/Notifications'

const NAV_ITEMS = [
  { id: 'notifications', label: 'Enquiries', emoji: '📧' },
  { id: 'sermons', label: 'Sermons', emoji: '📖' },
  { id: 'events', label: 'Events', emoji: '📅' },
  { id: 'announcements', label: 'Announcements', emoji: '📢' },
  { id: 'gallery', label: 'Gallery', emoji: '🖼️' },
  { id: 'executives', label: 'Executives', emoji: '👔' },
  { id: 'livestream', label: 'Livestream', emoji: '🎥' },
  { id: 'give', label: 'Give Settings', emoji: '💰' },
  { id: 'about', label: 'About Content', emoji: '📜' },
  { id: 'settings', label: 'Site Settings', emoji: '⚙️' },
  { id: 'admins', label: 'Manage Users', emoji: '👥' },
] as const

type TabId = typeof NAV_ITEMS[number]['id']

export default function TechnicianPage() {
  const [activeTab, setActiveTab] = useState<TabId>('sermons')
  const [user, setUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' as 'admin' | 'technician' })
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [savingUser, setSavingUser] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('technician-theme')
    if (savedTheme === 'dark') setIsDark(true)
  }, [])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('technician-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    const loggedInUser = await login(loginForm.username, loginForm.password)
    if (loggedInUser) {
      if (loggedInUser.role === 'admin') { setLoginError('Invalid username or password'); setLoading(false); return }
      setUser(loggedInUser)
      setShowGreeting(true)
      // Auto-hide greeting after 3 seconds
      setTimeout(() => setShowGreeting(false), 3000)
      loadUsers()
    } else { setLoginError('Invalid username or password') }
    setLoading(false)
  }

  const loadUsers = async () => { const users = await getUsers(); setAdminUsers(users) }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingUser(true)
    const success = await createUser(newUser.username, newUser.password, newUser.role)
    if (success) { alert('✅ User created!'); setNewUser({ username: '', password: '', role: 'admin' }); setShowAddUser(false); loadUsers() }
    else alert('❌ Failed. Username may already exist.')
    setSavingUser(false)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return
    if (await deleteUser(userId)) { alert('✅ Deleted!'); loadUsers() } else alert('❌ Failed.')
  }

  // ───────────── LOGIN SCREEN ─────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a0e] via-[#3a0f20] to-[#1a0a0e] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg shadow-pink-500/25 mb-4">
              <span className="text-3xl">🔧</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">Ebenezer Baptist Church</h1>
            <p className="text-pink-300/70 text-sm mt-1">Technician Portal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-1">Welcome Back 👋</h2>
              <p className="text-gray-400 text-sm mb-6">Sign in to manage content &amp; settings</p>

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
                      onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition"
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
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-500/25"
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
          <div className="animate-bounce-in bg-gradient-to-r from-pink-600 to-rose-600 text-white px-12 py-8 rounded-3xl shadow-2xl text-center">
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
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md shadow-pink-500/20">
              <span className="text-xl">🔧</span>
            </div>
            <div>
              <h1 className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Technician</h1>
              <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Full Access</p>
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
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 shadow-sm border border-pink-100'
                    : isDark 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-pink-500 rounded-full" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Technician Portal</p>
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
            {activeTab === 'executives' && <ExecutivesManager isDark={isDark} />}
            {activeTab === 'livestream' && <LivestreamManager isDark={isDark} />}
            {activeTab === 'give' && <GiveSettingsManager isDark={isDark} />}
            {activeTab === 'about' && <AboutContentManager isDark={isDark} />}
            {activeTab === 'settings' && <SiteSettingsManager isDark={isDark} />}
            {activeTab === 'admins' && <UserManager
              adminUsers={adminUsers}
              showAddUser={showAddUser}
              setShowAddUser={setShowAddUser}
              newUser={newUser}
              setNewUser={setNewUser}
              savingUser={savingUser}
              handleAddUser={handleAddUser}
              handleDeleteUser={handleDeleteUser}
              isDark={isDark}
            />}
          </div>
        </div>
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// USER MANAGER COMPONENT
// ═══════════════════════════════════════════════════

function UserManager({
  adminUsers, showAddUser, setShowAddUser, newUser, setNewUser, savingUser, handleAddUser, handleDeleteUser
}: {
  adminUsers: User[], showAddUser: boolean, setShowAddUser: (v: boolean) => void,
  newUser: { username: string; password: string; role: 'admin' | 'technician' },
  setNewUser: React.Dispatch<React.SetStateAction<{ username: string; password: string; role: 'admin' | 'technician' }>>,
  savingUser: boolean, handleAddUser: (e: React.FormEvent) => void, handleDeleteUser: (id: string) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span>👥</span> Users ({adminUsers.length})</h3>
        <button onClick={() => setShowAddUser(!showAddUser)} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-pink-500 hover:to-rose-500 transition">
          {showAddUser ? '✕ Cancel' : '➕ Add User'}
        </button>
      </div>
      {showAddUser && (
        <form onSubmit={handleAddUser} className="space-y-3 mb-6 bg-pink-50 p-4 rounded-xl border border-pink-100">
          <input value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" placeholder="👤 Username" required />
          <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" placeholder="🔒 Password" required />
          <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as 'admin' | 'technician'})} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
            <option value="admin">👑 Admin</option>
            <option value="technician">🔧 Technician</option>
          </select>
          <button type="submit" disabled={savingUser} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50">
            {savingUser ? '⏳ Creating...' : '✅ Create User'}
          </button>
        </form>
      )}
      <div className="space-y-2">
        {adminUsers.length === 0 ? (
          <p className="text-center py-8 text-gray-400">No users yet. Add your first one above! ☝️</p>
        ) : (
          adminUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{u.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{u.role === 'admin' ? '👑 Admin' : '🔧 Technician'}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                <span className="text-lg">🗑️</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// REUSABLE DELETE BUTTON
// ═══════════════════════════════════════════════════

function DeleteButton({ onClick, deleting }: { onClick: () => void; deleting: boolean }) {
  return (
    <button onClick={onClick} disabled={deleting} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50" title="Delete">
      {deleting ? <span className="text-xs">⏳</span> : <span className="text-lg">🗑️</span>}
    </button>
  )
}

// ═══════════════════════════════════════════════════
// SERMONS MANAGER
// ═══════════════════════════════════════════════════

function SermonsManager() {
  const [form, setForm] = useState({ title: '', preacher: '', bibleText: '', date: '', content: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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
    setSaving(true)
    try {
      const supabase = createClient()
      let imageUrl = ''
      
      // Upload image if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `sermon-${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, selectedFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
        imageUrl = publicUrlData.publicUrl
      }
      
      const { error } = await supabase.from('sermons').insert([{ ...form, image_url: imageUrl }])
      if (!error) { 
        alert('✅ Saved!')
        setForm({ title: '', preacher: '', bibleText: '', date: '', content: '' })
        setSelectedFile(null)
        setPreviewUrl(null)
        fetchSermons() 
      } else {
        alert('❌ Error: ' + error.message)
      }
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('Delete?')) return
    setDeleting(id)
    try {
      const supabase = createClient()
      // Delete image from storage if exists
      if (imageUrl && imageUrl.includes('/gallery/')) {
        const urlParts = imageUrl.split('/gallery/')
        if (urlParts.length > 1) await supabase.storage.from('gallery').remove([urlParts[1]])
      }
      const { error } = await supabase.from('sermons').delete().eq('id', id)
      if (!error) setSermons(prev => prev.filter(s => s.id !== id))
      else alert('❌ Error: ' + error.message)
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Sermon</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="📝 Title" required />
            <input value={form.preacher} onChange={e => setForm({...form, preacher: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="👤 Preacher" required />
            <input value={form.bibleText} onChange={e => setForm({...form, bibleText: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="📖 Bible Text" required />
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" required />
          </div>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={3} placeholder="📄 Content..." required />
          
          {/* Image Upload */}
          <div>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition cursor-pointer bg-white">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="text-2xl block mb-2">🖼️</span>
              <p className="text-sm text-gray-600 font-medium">Click to upload sermon image</p>
            </label>
            {previewUrl && (
              <div className="mt-3 flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Image selected</p>
                  <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="text-xs text-red-600 hover:text-red-700">✕ Remove</button>
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Sermon'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📚</span> All Sermons ({sermons.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
          <div className="space-y-2">
            {sermons.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No sermons yet! ☝️</p>
            ) : (
              sermons.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📖</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">📖 {s.title}</p>
                      <p className="text-xs text-gray-500">👤 {s.preacher} • 📅 {new Date(s.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <DeleteButton onClick={() => handleDelete(s.id, s.image_url)} deleting={deleting === s.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// EVENTS MANAGER
// ═══════════════════════════════════════════════════

function EventsManager() {
  const [form, setForm] = useState({ title: '', date: '', description: '', location: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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
    setSaving(true)
    try {
      const supabase = createClient()
      let imageUrl = ''
      
      // Upload image if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `event-${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, selectedFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
        imageUrl = publicUrlData.publicUrl
      }
      
      const { error } = await supabase.from('events').insert([{ ...form, image_url: imageUrl }])
      if (!error) { 
        alert('✅ Saved!')
        setForm({ title: '', date: '', description: '', location: '' })
        setSelectedFile(null)
        setPreviewUrl(null)
        fetchEvents() 
      } else {
        alert('❌ Error: ' + error.message)
      }
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('Delete?')) return
    setDeleting(id)
    try {
      const supabase = createClient()
      // Delete image from storage if exists
      if (imageUrl && imageUrl.includes('/gallery/')) {
        const urlParts = imageUrl.split('/gallery/')
        if (urlParts.length > 1) await supabase.storage.from('gallery').remove([urlParts[1]])
      }
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (!error) setEvents(prev => prev.filter(ev => ev.id !== id))
      else alert('❌ Error: ' + error.message)
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="📝 Title" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" required />
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="📍 Location" required />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={2} placeholder="📄 Description..." required />
          
          {/* Image Upload */}
          <div>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition cursor-pointer bg-white">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="text-2xl block mb-2">📸</span>
              <p className="text-sm text-gray-600 font-medium">Click to upload event image</p>
            </label>
            {previewUrl && (
              <div className="mt-3 flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Image selected</p>
                  <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="text-xs text-red-600 hover:text-red-700">✕ Remove</button>
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Event'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📆</span> All Events ({events.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No events yet! ☝️</p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {ev.image_url ? (
                      <img src={ev.image_url} alt={ev.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📅</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">📅 {ev.title}</p>
                      <p className="text-xs text-gray-500">📅 {new Date(ev.date).toLocaleDateString()} • 📍 {ev.location}</p>
                    </div>
                  </div>
                  <DeleteButton onClick={() => handleDelete(ev.id, ev.image_url)} deleting={deleting === ev.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// ANNOUNCEMENTS MANAGER
// ═══════════════════════════════════════════════════

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
    if (!error) { alert('✅ Saved!'); setForm({ title: '', content: '', priority: 'normal' }); fetchAnnouncements() }
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
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
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="📝 Title" required />
          <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="normal">🟢 Normal</option>
            <option value="high">🟡 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={3} placeholder="📄 Content..." required />
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📋</span> All Announcements ({announcements.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
          <div className="space-y-2">
            {announcements.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No announcements yet! ☝️</p>
            ) : (
              announcements.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{priorityEmoji[a.priority]}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${priorityBadge[a.priority]}`}>{a.priority}</span>
                      <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                    </div>
                    <p className="text-xs text-gray-500">📅 {new Date(a.date).toLocaleDateString()}</p>
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

// ═══════════════════════════════════════════════════
// GALLERY MANAGER
// ═══════════════════════════════════════════════════

function GalleryManager() {
  const [form, setForm] = useState({ title: '', category: 'General' })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(files)
      const urls: string[] = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          urls.push(reader.result as string)
          if (urls.length === files.length) {
            setPreviewUrls(urls)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return alert('❌ Select at least one image')
    setUploading(true)
    setUploadProgress(0)
    
    try {
      const supabase = createClient()
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${i}.${fileExt}`
        const filePath = `gallery/${fileName}`
        
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file)
        if (uploadError) throw uploadError
        
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
        uploadedUrls.push(publicUrlData.publicUrl)
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      }
      
      // Insert all images into database
      const imageData = uploadedUrls.map((url, index) => {
        const originalName = selectedFiles[index].name.split('.')[0] // Get filename without extension
        return {
          title: form.title || originalName, // Use custom title or original filename
          url: url,
          category: form.category
        }
      })

      const { error: dbError } = await supabase.from('gallery_images').insert(imageData)
      if (dbError) throw dbError
      
      alert(`✅ Successfully uploaded ${selectedFiles.length} image(s)!`)
      setForm({ title: '', category: 'General' })
      setSelectedFiles([])
      setPreviewUrls([])
      fetchImages()
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { 
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const clearSelection = () => {
    setSelectedFiles([])
    setPreviewUrls([])
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete?')) return
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
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Upload Images</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition cursor-pointer bg-white">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple required />
            <span className="text-4xl block mb-3">📁</span>
            <p className="text-base text-gray-700 font-semibold mb-1">Click to upload images</p>
            <p className="text-sm text-gray-500">Select multiple images at once (PNG, JPG, GIF up to 10MB each)</p>
          </label>
          
          {previewUrls.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  📸 {previewUrls.length} image(s) selected
                </p>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  ✕ Clear all
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              placeholder="📝 Title (optional - uses filename)" 
            />
            <select 
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {['General','Worship','Fellowship','Outreach','Events','Youth'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          {uploading && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Uploading...</span>
                <span className="text-sm font-bold text-pink-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-pink-600 to-rose-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={uploading || selectedFiles.length === 0} 
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md"
          >
            {uploading ? `⏳ Uploading ${selectedFiles.length} image(s)...` : `📤 Upload ${selectedFiles.length > 1 ? selectedFiles.length + ' Images' : 'Image'}`}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>🖼️</span> Gallery ({images.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
          images.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No images yet! ☝️</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
                  <img src={img.url} alt={img.title} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button onClick={() => handleDelete(img.id, img.url)} disabled={deleting === img.id} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                      {deleting === img.id ? '⏳' : '🗑️ Delete'}
                    </button>
                  </div>
                  <p className="text-xs text-center py-1 truncate px-8">📂 {img.title}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// EXECUTIVES MANAGER
// ═══════════════════════════════════════════════════

function ExecutivesManager() {
  const [form, setForm] = useState({ name: '', title: '', bio: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [executives, setExecutives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchExecutives() }, [])
  const fetchExecutives = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('executives').select('*').order('sort_order', { ascending: true })
    if (data) setExecutives(data)
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
    setSaving(true)
    try {
      let imageUrl = ''
      if (selectedFile) {
        const supabase = createClient()
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `exec-${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, selectedFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
        imageUrl = publicUrlData.publicUrl
      }
      const supabase = createClient()
      const { error } = await supabase.from('executives').insert([{ ...form, image_url: imageUrl }])
      if (error) throw error
      alert('✅ Executive saved!')
      setForm({ name: '', title: '', bio: '' })
      setSelectedFile(null)
      setPreviewUrl(null)
      fetchExecutives()
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this executive?')) return
    setDeleting(id)
    try {
      const supabase = createClient()
      if (imageUrl && imageUrl.includes('/gallery/')) {
        const urlParts = imageUrl.split('/gallery/')
        if (urlParts.length > 1) await supabase.storage.from('gallery').remove([urlParts[1]])
      }
      await supabase.from('executives').delete().eq('id', id)
      setExecutives(prev => prev.filter(ex => ex.id !== id))
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { setDeleting(null) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>✨</span> Add Executive</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="👤 Full Name" required />
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="🏷️ Title" required />
          </div>
          <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={2} placeholder="📄 Bio (optional)" />
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg" />}
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md">
            {saving ? '⏳ Saving...' : '💾 Add Executive'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>👔</span> All Executives ({executives.length})</h3>
        {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
          executives.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No executives yet! ☝️</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {executives.map(ex => (
                <div key={ex.id} className="bg-gray-50 rounded-xl border border-gray-100 hover:border-pink-200 overflow-hidden transition">
                  <div className="relative h-40 bg-gray-200">
                    {ex.image_url ? <img src={ex.image_url} alt={ex.name} className="w-full h-full object-cover" /> : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button onClick={() => handleDelete(ex.id, ex.image_url)} disabled={deleting === ex.id} className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50">
                        {deleting === ex.id ? '⏳' : '✕'}
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-gray-900 truncate">👤 {ex.name}</p>
                    <p className="text-xs text-pink-600 font-semibold">🏷️ {ex.title}</p>
                    {ex.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ex.bio}</p>}
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

// ═══════════════════════════════════════════════════
// LIVESTREAM MANAGER
// ═══════════════════════════════════════════════════

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
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2"><span>🎥</span> Livestream Settings</h3>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Stream URL</label>
              <input type="url" value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm font-medium text-gray-700">Stream is active</span>
            </label>
            {form.isActive && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-700 text-sm font-semibold">🔴 LIVE — Broadcasting</span>
              </div>
            )}
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-md">
              {saving ? '⏳ Saving...' : '💾 Update'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SITE SETTINGS MANAGER
// ═══════════════════════════════════════════════════

function SiteSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('/logo.png')

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('setting_key, setting_value')
    if (data) {
      const settingsObj: Record<string, string> = {}
      data.forEach(s => { settingsObj[s.setting_key] = s.setting_value || '' })
      setSettings(settingsObj)
      if (settingsObj.logo_url) setLogoPreview(settingsObj.logo_url)
    }
    setLoading(false)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let logoUrl = settings.logo_url || '/logo.png'
      if (logoFile) {
        const supabase = createClient()
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `logo-${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, logoFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
        logoUrl = publicUrlData.publicUrl
      }
      const supabase = createClient()
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: key === 'logo_url' ? logoUrl : value,
        updated_at: new Date().toISOString()
      }))
      for (const setting of settingsToSave) {
        const { error } = await supabase.from('site_settings').upsert(setting, { onConflict: 'setting_key' })
        if (error) throw error
      }
      alert('✅ Site settings saved!')
      fetchSettings()
    } catch (error: any) {
      alert('❌ Error: ' + error.message)
    } finally { setSaving(false) }
  }

  if (loading) return <p className="text-center py-8 text-gray-400">⏳ Loading settings...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-4 rounded-xl">
        <h3 className="font-bold text-lg flex items-center gap-2">⚙️ Site Settings</h3>
        <p className="text-sm text-white/80">Manage church name, logo, address, and all website content</p>
      </div>

      {/* Church Identity */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">⛪ Church Identity</h4>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Church Name</label>
          <input value={settings.church_name || ''} onChange={e => setSettings({...settings, church_name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="Ebenezer Baptist Church" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Tagline / Motto</label>
          <input value={settings.church_tagline || ''} onChange={e => setSettings({...settings, church_tagline: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="A Place of Worship and Community" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Church Motto (Verse)</label>
          <input value={settings.church_motto || ''} onChange={e => setSettings({...settings, church_motto: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="...led by the Spirit of God" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Founded Year</label>
          <input value={settings.founded_year || ''} onChange={e => setSettings({...settings, founded_year: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="1888" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Church Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          {logoPreview && (
            <div className="mt-2 flex items-center gap-3">
              <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto rounded-lg border bg-white p-1" />
              <span className="text-xs text-gray-500">Current logo</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">📞 Contact Information</h4>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Address</label>
          <textarea value={settings.church_address || ''} onChange={e => setSettings({...settings, church_address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={2} placeholder="50A Campbell Street, Lagos Island, Lagos" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone</label>
            <input value={settings.church_phone || ''} onChange={e => setSettings({...settings, church_phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="+234 802 345 6789" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
            <input type="email" value={settings.church_email || ''} onChange={e => setSettings({...settings, church_email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="info@ebenezerbaptist.org" />
          </div>
        </div>
      </div>

      {/* Service Times */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">🕐 Service Times</h4>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Sunday Service</label>
          <textarea value={settings.service_times || ''} onChange={e => setSettings({...settings, service_times: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows={2} placeholder="Sunday School: 9:00 AM | Main Service: 10:00 AM" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Wednesday Service</label>
          <input value={settings.wednesday_service || ''} onChange={e => setSettings({...settings, wednesday_service: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="Wednesday Bible Study: 6:00 PM" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Friday Service</label>
          <input value={settings.friday_service || ''} onChange={e => setSettings({...settings, friday_service: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="Friday Prayer Meeting: 7:00 PM" />
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">📊 Statistics Display</h4>
        <p className="text-xs text-gray-600 mb-2">These numbers appear on the homepage</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Community Count</label>
            <input value={settings.stat_community || ''} onChange={e => setSettings({...settings, stat_community: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="300+" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Active Members</label>
            <input value={settings.stat_active_members || ''} onChange={e => setSettings({...settings, stat_active_members: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="359+" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Years of Service</label>
            <input value={settings.stat_years || ''} onChange={e => setSettings({...settings, stat_years: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="138+" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">🌐 Social Media Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Facebook URL</label>
            <input value={settings.facebook_url || ''} onChange={e => setSettings({...settings, facebook_url: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Twitter/X URL</label>
            <input value={settings.twitter_url || ''} onChange={e => setSettings({...settings, twitter_url: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://twitter.com/..." />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Instagram URL</label>
            <input value={settings.instagram_url || ''} onChange={e => setSettings({...settings, instagram_url: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">YouTube URL</label>
            <input value={settings.youtube_url || ''} onChange={e => setSettings({...settings, youtube_url: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-500/25"
      >
        {saving ? '⏳ Saving...' : '💾 Save All Settings'}
      </button>
    </form>
  )
}

// ═══════════════════════════════════════════════════
// GIVE SETTINGS MANAGER
// ═══════════════════════════════════════════════════

interface GiveAccount {
  id: string
  bank: string
  purpose: string
  account_name: string
  account_number: string
  sort_order: number
  is_active: boolean
}

function GiveSettingsManager() {
  const [accounts, setAccounts] = useState<GiveAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    bank: '',
    purpose: '',
    account_name: '',
    account_number: '',
    sort_order: accounts.length + 1,
    is_active: true
  })

  useEffect(() => { fetchAccounts() }, [])

  const fetchAccounts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('give_accounts').select('*').order('sort_order', { ascending: true })
    if (data) setAccounts(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('give_accounts').insert([newAccount])
    if (!error) {
      alert('✅ Account added!')
      setNewAccount({ bank: '', purpose: '', account_name: '', account_number: '', sort_order: accounts.length + 1, is_active: true })
      setShowAddForm(false)
      fetchAccounts()
    } else {
      alert('❌ Error: ' + error.message)
    }
    setSaving(false)
  }

  const handleUpdate = async (id: string, updates: Partial<GiveAccount>) => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('give_accounts').update(updates).eq('id', id)
    if (!error) {
      alert('✅ Account updated!')
      setEditingId(null)
      fetchAccounts()
    } else {
      alert('❌ Error: ' + error.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this account?')) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('give_accounts').delete().eq('id', id)
    if (!error) {
      alert('✅ Account deleted!')
      fetchAccounts()
    } else {
      alert('❌ Error: ' + error.message)
    }
    setDeleting(null)
  }

  if (loading) return <p className="text-center py-8 text-gray-400">⏳ Loading give accounts...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><span>💰</span> Bank Accounts ({accounts.length})</h3>
          <p className="text-sm text-gray-500 mt-1">Manage bank accounts displayed on the Give page</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-pink-500 hover:to-rose-500 transition"
        >
          {showAddForm ? '✕ Cancel' : '➕ Add Account'}
        </button>
      </div>

      {/* Add New Account Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-pink-50 p-5 rounded-xl border border-pink-100 space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span>✨</span> Add New Account</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              value={newAccount.bank} 
              onChange={e => setNewAccount({...newAccount, bank: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
              placeholder="🏦 Bank Name" 
              required 
            />
            <input 
              value={newAccount.purpose} 
              onChange={e => setNewAccount({...newAccount, purpose: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
              placeholder="🎯 Purpose (e.g., Tithes)" 
              required 
            />
            <input 
              value={newAccount.account_name} 
              onChange={e => setNewAccount({...newAccount, account_name: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
              placeholder="👤 Account Name" 
              required 
            />
            <input 
              value={newAccount.account_number} 
              onChange={e => setNewAccount({...newAccount, account_number: e.target.value})} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
              placeholder="🔢 Account Number" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={saving} 
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? '⏳ Adding...' : '💾 Add Account'}
          </button>
        </form>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-3 block">💳</span>
          <p className="text-gray-500">No bank accounts yet. Add your first account above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-pink-200 transition">
              {editingId === account.id ? (
                <EditAccountForm 
                  account={account} 
                  onSave={(updates) => handleUpdate(account.id, updates)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏦</span>
                      <h4 className="font-bold text-gray-900">{account.bank}</h4>
                      {!account.is_active && (
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Purpose:</span> {account.purpose}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Account Name:</span> {account.account_name}</p>
                    <p className="text-sm font-mono font-bold text-gray-900"><span className="font-semibold">Account Number:</span> {account.account_number}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => setEditingId(account.id)} 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(account.id)} 
                      disabled={deleting === account.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === account.id ? (
                        <span className="text-xs">⏳</span>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════
// EDIT ACCOUNT FORM
// ═══════════════════════════════════════════════════

function EditAccountForm({ 
  account, 
  onSave, 
  onCancel, 
  saving 
}: { 
  account: GiveAccount
  onSave: (updates: Partial<GiveAccount>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({
    bank: account.bank,
    purpose: account.purpose,
    account_name: account.account_name,
    account_number: account.account_number,
    sort_order: account.sort_order,
    is_active: account.is_active
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input 
          value={form.bank} 
          onChange={e => setForm({...form, bank: e.target.value})} 
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
          placeholder="Bank Name" 
          required 
        />
        <input 
          value={form.purpose} 
          onChange={e => setForm({...form, purpose: e.target.value})} 
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
          placeholder="Purpose" 
          required 
        />
        <input 
          value={form.account_name} 
          onChange={e => setForm({...form, account_name: e.target.value})} 
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
          placeholder="Account Name" 
          required 
        />
        <input 
          value={form.account_number} 
          onChange={e => setForm({...form, account_number: e.target.value})} 
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white" 
          placeholder="Account Number" 
          required 
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={form.is_active} 
            onChange={e => setForm({...form, is_active: e.target.checked})}
            className="w-4 h-4 text-pink-600 rounded"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Sort Order:</span>
          <input 
            type="number" 
            value={form.sort_order} 
            onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})}
            className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm"
            min="1"
          />
        </label>
      </div>
      <div className="flex gap-3">
        <button 
          type="submit" 
          disabled={saving} 
          className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50"
        >
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════
// ABOUT CONTENT MANAGER
// ═══════════════════════════════════════════════════

function AboutContentManager() {
  const [historyContent, setHistoryContent] = useState('')
  const [missionContent, setMissionContent] = useState('')
  const [visionContent, setVisionContent] = useState('')
  const [coreValues, setCoreValues] = useState<Array<{ id: string; title: string; description: string; sort_order: number }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'history' | 'mission-vision' | 'core-values'>('history')
  const [newCoreValue, setNewCoreValue] = useState({ title: '', description: '' })

  useEffect(() => { fetchAboutContent() }, [])

  const fetchAboutContent = async () => {
    const supabase = createClient()
    
    const { data: historyData } = await supabase.from('about_content').select('content').eq('section', 'history').single()
    const { data: missionData } = await supabase.from('about_content').select('content').eq('section', 'mission').single()
    const { data: visionData } = await supabase.from('about_content').select('content').eq('section', 'vision').single()
    const { data: coreValuesData } = await supabase.from('core_values').select('*').order('sort_order', { ascending: true })
    
    if (historyData) setHistoryContent(historyData.content)
    if (missionData) setMissionContent(missionData.content)
    if (visionData) setVisionContent(visionData.content)
    if (coreValuesData) setCoreValues(coreValuesData)
    setLoading(false)
  }

  const handleSaveHistory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('about_content').upsert({ section: 'history', content: historyContent, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    if (!error) alert('✅ History saved!')
    else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleSaveMissionVision = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error: missionError } = await supabase.from('about_content').upsert({ section: 'mission', content: missionContent, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    const { error: visionError } = await supabase.from('about_content').upsert({ section: 'vision', content: visionContent, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    if (!missionError && !visionError) alert('✅ Mission & Vision saved!')
    else alert('❌ Error: ' + (missionError?.message || visionError?.message))
    setSaving(false)
  }

  const handleAddCoreValue = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('core_values').insert([{ ...newCoreValue, sort_order: coreValues.length + 1 }])
    if (!error) {
      alert('✅ Core value added!')
      setNewCoreValue({ title: '', description: '' })
      fetchAboutContent()
    } else alert('❌ Error: ' + error.message)
    setSaving(false)
  }

  const handleDeleteCoreValue = async (id: string) => {
    if (!confirm('Delete this core value?')) return
    const supabase = createClient()
    const { error } = await supabase.from('core_values').delete().eq('id', id)
    if (!error) {
      alert('✅ Deleted!')
      fetchAboutContent()
    } else alert('❌ Error: ' + error.message)
  }

  if (loading) return <p className="text-center py-8 text-gray-400">⏳ Loading content...</p>

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveSection('history')} className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${activeSection === 'history' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          📜 History
        </button>
        <button onClick={() => setActiveSection('mission-vision')} className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${activeSection === 'mission-vision' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          🎯 Mission & Vision
        </button>
        <button onClick={() => setActiveSection('core-values')} className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${activeSection === 'core-values' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          💎 Core Values
        </button>
      </div>

      {/* History Section */}
      {activeSection === 'history' && (
        <form onSubmit={handleSaveHistory} className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><span>📜</span> Church History</h3>
            <textarea
              value={historyContent}
              onChange={(e) => setHistoryContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={15}
              placeholder="Enter the church history..."
              required
            />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Use multiple paragraphs to organize the history</p>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg">
            {saving ? '⏳ Saving...' : '💾 Save History'}
          </button>
        </form>
      )}

      {/* Mission & Vision Section */}
      {activeSection === 'mission-vision' && (
        <form onSubmit={handleSaveMissionVision} className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100 space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><span>🎯</span> Mission & Vision</h3>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Vision</label>
              <textarea
                value={visionContent}
                onChange={(e) => setVisionContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={4}
                placeholder="Enter the church vision..."
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Mission</label>
              <textarea
                value={missionContent}
                onChange={(e) => setMissionContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={6}
                placeholder="Enter the church mission..."
                required
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg">
            {saving ? '⏳ Saving...' : '💾 Save Mission & Vision'}
          </button>
        </form>
      )}

      {/* Core Values Section */}
      {activeSection === 'core-values' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCoreValue} className="bg-pink-50 p-5 rounded-xl border border-pink-100 space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span>✨</span> Add Core Value</h4>
            <input
              value={newCoreValue.title}
              onChange={(e) => setNewCoreValue({ ...newCoreValue, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white"
              placeholder="Title (e.g., Faith Inspired)"
              required
            />
            <textarea
              value={newCoreValue.description}
              onChange={(e) => setNewCoreValue({ ...newCoreValue, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white"
              rows={2}
              placeholder="Description..."
              required
            />
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50">
              {saving ? '⏳ Adding...' : '➕ Add Core Value'}
            </button>
          </form>

          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><span>💎</span> Core Values ({coreValues.length})</h3>
            {coreValues.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <span className="text-4xl mb-3 block">💎</span>
                <p className="text-gray-500">No core values yet. Add your first one above!</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {coreValues.map((value) => (
                  <div key={value.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">💎 {value.title}</h4>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                      <button onClick={() => handleDeleteCoreValue(value.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition ml-3" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
