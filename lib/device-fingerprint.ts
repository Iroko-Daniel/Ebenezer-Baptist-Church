/**
 * Device Fingerprint Utility
 * Extracts detailed device information from browser APIs
 */

export interface DeviceInfo {
  ipAddress: string | null
  userAgent: string | null
  browserName: string | null
  browserVersion: string | null
  osName: string | null
  osVersion: string | null
  deviceType: string | null
  deviceName: string | null
  screenResolution: string | null
  language: string | null
  connectionType: string | null
  networkType: string | null
  platform: string | null
  cpuCores: number | null
  memory: number | null
  touchSupport: boolean | null
  timezone: string | null
}

/**
 * Detect browser name and version from user agent
 */
function detectBrowser(userAgent: string): { name: string; version: string } {
  const ua = userAgent
  
  // Chrome (must be before Edge check since Edge also has Chrome)
  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/([^\s]+)/)
    return { name: 'Microsoft Edge', version: match?.[1] || 'Unknown' }
  }
  
  if (ua.includes('Chrome/') && !ua.includes('Chromium')) {
    const match = ua.match(/Chrome\/([^\s]+)/)
    return { name: 'Google Chrome', version: match?.[1] || 'Unknown' }
  }
  
  // Firefox
  if (ua.includes('Firefox/')) {
    const match = ua.match(/Firefox\/([^\s]+)/)
    return { name: 'Mozilla Firefox', version: match?.[1] || 'Unknown' }
  }
  
  // Safari
  if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    const match = ua.match(/Version\/([^\s]+)/)
    return { name: 'Safari', version: match?.[1] || 'Unknown' }
  }
  
  // Samsung Internet
  if (ua.includes('SamsungBrowser/')) {
    const match = ua.match(/SamsungBrowser\/([^\s]+)/)
    return { name: 'Samsung Internet', version: match?.[1] || 'Unknown' }
  }
  
  // Opera
  if (ua.includes('OPR/') || ua.includes('Opera/')) {
    const match = ua.match(/(?:OPR|Opera)\/([^\s]+)/)
    return { name: 'Opera', version: match?.[1] || 'Unknown' }
  }
  
  return { name: 'Unknown Browser', version: 'Unknown' }
}

/**
 * Detect operating system and version
 */
function detectOS(userAgent: string): { name: string; version: string } {
  const ua = userAgent
  
  // Windows
  if (ua.includes('Windows NT')) {
    const match = ua.match(/Windows NT ([\d.]+)/)
    const versionMap: Record<string, string> = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP'
    }
    const ntVersion = match?.[1] || ''
    return { name: 'Windows', version: versionMap[ntVersion] || ntVersion }
  }
  
  // macOS
  if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X ([\d_]+)/)
    return { name: 'macOS', version: match?.[1]?.replace(/_/g, '.') || 'Unknown' }
  }
  
  // Android
  if (ua.includes('Android')) {
    const match = ua.match(/Android ([\d.]+)/)
    return { name: 'Android', version: match?.[1] || 'Unknown' }
  }
  
  // iOS
  if (ua.includes('iPhone OS') || ua.includes('iPad')) {
    const match = ua.match(/OS ([\d_]+)/)
    return { name: 'iOS', version: match?.[1]?.replace(/_/g, '.') || 'Unknown' }
  }
  
  // Linux
  if (ua.includes('Linux')) {
    return { name: 'Linux', version: 'Unknown' }
  }
  
  return { name: 'Unknown OS', version: 'Unknown' }
}

/**
 * Detect device type
 */
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile')) return 'Mobile'
  if (ua.includes('tablet')) return 'Tablet'
  if (ua.includes('ipad')) return 'Tablet'
  if (ua.includes('android') && !ua.includes('mobile')) return 'Tablet'
  
  return 'Desktop'
}

/**
 * Get device name (approximate based on screen size and platform)
 */
function getDeviceName(userAgent: string, screenResolution: string): string {
  const ua = userAgent.toLowerCase()
  const devices: string[] = []
  
  // Platform
  if (ua.includes('windows')) devices.push('Windows PC')
  else if (ua.includes('macintosh') || ua.includes('mac os x')) devices.push('Mac')
  else if (ua.includes('android')) devices.push('Android Device')
  else if (ua.includes('iphone')) devices.push('iPhone')
  else if (ua.includes('ipad')) devices.push('iPad')
  
  // Screen size hints
  if (screenResolution) {
    const [width] = screenResolution.split('x').map(Number)
    if (width >= 2560) devices.push('Large Monitor')
    else if (width >= 1920) devices.push('Full HD Display')
    else if (width >= 1366) devices.push('Standard Laptop')
    else if (width >= 768) devices.push('Tablet/Small Laptop')
    else devices.push('Mobile Device')
  }
  
  return devices.join(' - ') || 'Unknown Device'
}

/**
 * Get connection information
 */
function getConnectionInfo(): { type: string; networkType: string } {
  const conn = (navigator as any).connection || 
               (navigator as any).mozConnection || 
               (navigator as any).webkitConnection
  
  if (conn) {
    const connectionType = conn.effectiveType || conn.type || 'Unknown'
    const networkType = conn.type === 'wifi' ? 'WiFi' : 
                        conn.type === 'cellular' ? 'Mobile Network' :
                        connectionType.includes('4g') ? 'Mobile Network (4G)' :
                        connectionType.includes('3g') ? 'Mobile Network (3G)' :
                        connectionType.includes('2g') ? 'Mobile Network (2G)' :
                        'Unknown'
    return { type: connectionType, networkType }
  }
  
  return { type: 'Unknown', networkType: 'Unknown' }
}

/**
 * Collect comprehensive device information
 */
export async function collectDeviceInfo(): Promise<DeviceInfo> {
  const userAgent = navigator.userAgent || null
  const connection = getConnectionInfo()
  
  let ipAddress: string | null = null
  
  // Try to get public IP address
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    ipAddress = data.ip || null
  } catch (error) {
    console.warn('Could not fetch IP address:', error)
    // Fallback to a public IP service
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      ipAddress = data.ip || null
    } catch (fallbackError) {
      console.warn('Fallback IP fetch also failed:', fallbackError)
    }
  }
  
  const browser = userAgent ? detectBrowser(userAgent) : { name: null, version: null }
  const os = userAgent ? detectOS(userAgent) : { name: null, version: null }
  const screenResolution = screen ? `${screen.width}x${screen.height}` : null
  
  return {
    ipAddress,
    userAgent,
    browserName: browser.name,
    browserVersion: browser.version,
    osName: os.name,
    osVersion: os.version,
    deviceType: userAgent ? detectDeviceType(userAgent) : null,
    deviceName: userAgent ? getDeviceName(userAgent, screenResolution || 'Unknown') : null,
    screenResolution,
    language: navigator.language || null,
    connectionType: connection.type,
    networkType: connection.networkType,
    platform: navigator.platform || null,
    cpuCores: navigator.hardwareConcurrency || null,
    memory: (navigator as any).deviceMemory || null,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null
  }
}

/**
 * Format device info for display
 */
export function formatDeviceInfo(info: DeviceInfo): string {
  const parts: string[] = []
  
  if (info.browserName) parts.push(info.browserName)
  if (info.osName) parts.push(info.osName)
  if (info.deviceType) parts.push(info.deviceType)
  
  return parts.join(' | ') || 'Unknown Device'
}
