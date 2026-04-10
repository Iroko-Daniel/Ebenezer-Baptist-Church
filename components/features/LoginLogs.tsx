'use client'

import { useState, useEffect } from 'react'
import { getLoginLogs, deleteLoginLog, clearAllLoginLogs, LoginLog } from '@/lib/auth'

export default function LoginLogs() {
  const [logs, setLogs] = useState<LoginLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    const data = await getLoginLogs()
    if (data.length === 0) {
      console.warn('No login logs found or database schema needs updating')
    }
    setLogs(data)
    setLoading(false)
  }

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Delete this login log?')) return
    setDeleting(logId)
    const success = await deleteLoginLog(logId)
    if (success) {
      setLogs(prev => prev.filter(log => log.id !== logId))
    } else {
      alert('Failed to delete log')
    }
    setDeleting(null)
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL login logs? This cannot be undone.')) return
    const success = await clearAllLoginLogs()
    if (success) {
      setLogs([])
      alert('All login logs cleared')
    } else {
      alert('Failed to clear logs')
    }
  }

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'Mobile': return '📱'
      case 'Tablet': return '📱'
      case 'Desktop': return '💻'
      default: return '🖥️'
    }
  }

  const getBrowserIcon = (browserName: string | null) => {
    if (!browserName) return '🌐'
    if (browserName.includes('Chrome')) return '🌐'
    if (browserName.includes('Firefox')) return '🦊'
    if (browserName.includes('Safari')) return '🧭'
    if (browserName.includes('Edge')) return '🔵'
    if (browserName.includes('Opera')) return '🔴'
    return '🌐'
  }

  const getOSIcon = (osName: string | null) => {
    if (!osName) return '💿'
    if (osName.includes('Windows')) return '🪟'
    if (osName.includes('macOS')) return '🍎'
    if (osName.includes('Android')) return '🤖'
    if (osName.includes('iOS')) return '📱'
    if (osName.includes('Linux')) return '🐧'
    return '💿'
  }

  const getNetworkIcon = (networkType: string | null) => {
    if (!networkType) return '📡'
    if (networkType.includes('WiFi')) return '📶'
    if (networkType.includes('Mobile')) return '📡'
    return '📡'
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getSessionDuration = (loginAt: string, logoutAt: string | null) => {
    if (!logoutAt) return 'Active'
    const login = new Date(loginAt).getTime()
    const logout = new Date(logoutAt).getTime()
    const duration = logout - login
    
    const minutes = Math.floor(duration / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>📊</span> Login History ({logs.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition"
          >
            🔄 Refresh
          </button>
          {logs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-3">Loading login logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <span className="text-5xl block mb-4">📊</span>
          <p>No login logs found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Device</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Browser</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Network</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Login Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr 
                    key={log.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.role === 'technician' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <span className="text-sm">👤</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{log.username}</p>
                          <p className="text-xs text-gray-500 capitalize">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getDeviceIcon(log.device_type)}</span>
                        <div>
                          <p className="font-semibold text-gray-900 truncate max-w-[180px]" title={log.device_name || 'Unknown'}>
                            {log.device_name || 'Unknown Device'}
                          </p>
                          <p className="text-xs text-gray-500">{log.os_name} {log.os_version} • {log.device_type || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getBrowserIcon(log.browser_name)}</span>
                        <span className="text-gray-700">{log.browser_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.ip_address || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getNetworkIcon(log.network_type)}</span>
                        <span className="text-xs text-gray-600">{log.network_type || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-xs text-gray-700">{formatDateTime(log.login_at)}</p>
                        {log.is_active && (
                          <span className="text-xs text-green-600 font-medium">● Active</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        log.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getSessionDuration(log.login_at, log.logout_at)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteLog(log.id)
                        }}
                        disabled={deleting === log.id}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                      >
                        {deleting === log.id ? '⏳' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {logs.map(log => (
              <div 
                key={log.id}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.role === 'technician' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{log.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{log.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteLog(log.id)
                    }}
                    disabled={deleting === log.id}
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg transition disabled:opacity-50"
                  >
                    {deleting === log.id ? '⏳' : '🗑️'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{getDeviceIcon(log.device_type)}</span>
                    <div>
                      <p className="text-xs text-gray-500">Device</p>
                      <p className="font-medium text-gray-800 text-xs truncate max-w-[120px]">
                        {log.device_name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{getBrowserIcon(log.browser_name)}</span>
                    <div>
                      <p className="text-xs text-gray-500">Browser</p>
                      <p className="font-medium text-gray-800 text-xs">{log.browser_name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{getOSIcon(log.os_name)}</span>
                    <div>
                      <p className="text-xs text-gray-500">OS</p>
                      <p className="font-medium text-gray-800 text-xs">{log.os_name} {log.os_version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{getNetworkIcon(log.network_type)}</span>
                    <div>
                      <p className="text-xs text-gray-500">Network</p>
                      <p className="font-medium text-gray-800 text-xs">{log.network_type || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                      {log.ip_address || 'Unknown'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Login Time</p>
                    <p className="font-medium text-gray-800 text-xs">{formatDateTime(log.login_at)}</p>
                  </div>
                </div>

                {log.is_active && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-green-600 font-medium">● Currently Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail Modal */}
          {selectedLog && (
            <div 
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLog(null)}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🔍 Login Details
                  </h3>
                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      👤 User Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-blue-700">Username</p>
                        <p className="font-semibold text-blue-900">{selectedLog.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Role</p>
                        <p className="font-semibold text-blue-900 capitalize">{selectedLog.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Device Information */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      💻 Device Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-purple-700">Device Type</p>
                        <p className="font-medium text-purple-900">
                          {getDeviceIcon(selectedLog.device_type)} {selectedLog.device_type || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Device Name</p>
                        <p className="font-medium text-purple-900">{selectedLog.device_name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Operating System</p>
                        <p className="font-medium text-purple-900">
                          {selectedLog.os_name} {selectedLog.os_version}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Screen Resolution</p>
                        <p className="font-medium text-purple-900">{selectedLog.screen_resolution || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Platform</p>
                        <p className="font-medium text-purple-900">{selectedLog.platform || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Touch Support</p>
                        <p className="font-medium text-purple-900">
                          {selectedLog.touch_support ? 'Yes ✓' : 'No ✗'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">CPU Cores</p>
                        <p className="font-medium text-purple-900">{selectedLog.cpu_cores || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Memory</p>
                        <p className="font-medium text-purple-900">
                          {selectedLog.memory_mb ? `${selectedLog.memory_mb} GB` : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Browser Information */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      🌐 Browser Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-green-700">Browser</p>
                        <p className="font-medium text-green-900">
                          {getBrowserIcon(selectedLog.browser_name)} {selectedLog.browser_name} {selectedLog.browser_version}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Language</p>
                        <p className="font-medium text-green-900">{selectedLog.language || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Timezone</p>
                        <p className="font-medium text-green-900">{selectedLog.timezone || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-green-700 mb-1">User Agent String</p>
                      <p className="text-xs font-mono bg-white p-2 rounded border border-green-200 break-all">
                        {selectedLog.user_agent || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Network Information */}
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                      📡 Network Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-orange-700">IP Address</p>
                        <p className="font-mono font-medium text-orange-900 bg-white px-2 py-1 rounded inline-block">
                          {selectedLog.ip_address || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-700">Network Type</p>
                        <p className="font-medium text-orange-900">
                          {getNetworkIcon(selectedLog.network_type)} {selectedLog.network_type || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-700">Connection Type</p>
                        <p className="font-medium text-orange-900">{selectedLog.connection_type || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Information */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      ⏱️ Session Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-700">Login Time</p>
                        <p className="font-medium text-gray-900">{formatDateTime(selectedLog.login_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700">Logout Time</p>
                        <p className="font-medium text-gray-900">{formatDateTime(selectedLog.logout_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700">Session Duration</p>
                        <p className="font-medium text-gray-900">
                          {getSessionDuration(selectedLog.login_at, selectedLog.logout_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700">Status</p>
                        <p className="font-medium">
                          {selectedLog.is_active ? (
                            <span className="text-green-600">● Active</span>
                          ) : (
                            <span className="text-gray-600">Ended</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        handleDeleteLog(selectedLog.id)
                        setSelectedLog(null)
                      }}
                      disabled={deleting === selectedLog.id}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {deleting === selectedLog.id ? '⏳ Deleting...' : '🗑️ Delete Log'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
