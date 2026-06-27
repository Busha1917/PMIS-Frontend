/**
 * helpers.ts
 * Utility functions adapted from Addis Land frontend for use in PMIS.
 */

// ─── Date & Time ────────────────────────────────────────────────────────────

/**
 * Format an ISO date string into a readable locale string.
 * e.g. "2024-06-15" → "June 15, 2024"
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date to "MMM dd, yyyy"
 * e.g. "Jun 15, 2024"
 */
export const formatDateShort = (dateString: string | Date): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date for use in an <input type="date"> (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string | Date): string => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

/**
 * Get a human-readable relative time string.
 * e.g. "5 minutes ago", "2 days ago"
 */
export const timeAgo = (dateString: string | Date): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDateShort(date)
}

/**
 * Get the current date formatted as "YYYY-MM-DD" (for API calls).
 */
export const currentDateISO = (): string => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ─── Numbers & Currency ──────────────────────────────────────────────────────

/**
 * Format a number as Ethiopian Birr currency.
 * e.g. 1000 → "ETB 1,000.00"
 */
export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return 'N/A'
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(num)
}

/**
 * Convert bytes to megabytes string.
 */
export const bytesToMB = (bytes: number): string => (bytes / (1024 * 1024)).toFixed(2)

// ─── Strings ─────────────────────────────────────────────────────────────────

/**
 * Truncate a string to maxLength characters, appending "…" if truncated.
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''

/**
 * Convert a snake_case or SCREAMING_SNAKE_CASE string to Title Case.
 */
export const snakeToTitle = (str: string): string =>
  str.toLowerCase().split('_').map(capitalize).join(' ')

/**
 * Get initials from a name (up to 2 letters).
 * e.g. "Alexander Mekuria" → "AM"
 */
export const getInitials = (name: string): string => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ─── Validation Helpers ──────────────────────────────────────────────────────

/**
 * Password strength calculator (adapted from Addis Land).
 */
export interface PasswordStrength {
  score: number // 0–4
  label: string
  color: string // Tailwind bg-* class
  requirements: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  const empty: PasswordStrength = {
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500',
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  }
  if (!password) return empty

  const req = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  let score = Object.values(req).filter(Boolean).length
  if (password.length >= 12) score = Math.min(score + 0.5, 4)
  if (password.length >= 16) score = Math.min(score + 0.5, 4)
  score = Math.min(Math.floor(score), 4)

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong']
  const colors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  return { score, label: labels[score], color: colors[score], requirements: req }
}

export const strengthPercentage = (score: number): number => (score / 4) * 100

// ─── FormData helpers ────────────────────────────────────────────────────────

/**
 * Convert a FormData object into a plain JS object, handling repeated keys.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formDataToObject = (formData: FormData): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: Record<string, any> = {}
  for (const [key, value] of formData.entries()) {
    if (obj[key] !== undefined) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value]
    } else {
      obj[key] = value
    }
  }
  return obj
}

// ─── Debounce ────────────────────────────────────────────────────────────────

/**
 * Debounce a function call (adapted from Addis Land).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ─── Status helpers ───────────────────────────────────────────────────────────

/**
 * Get a Tailwind color class pair for a status value used across PMIS.
 */
export const getStatusColors = (status: string): { bg: string; text: string; ring: string } => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'accepted':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/20' }
    case 'pending':
    case 'draft':
      return { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-500/20' }
    case 'rejected':
    case 'inactive':
    case 'suspended':
      return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20' }
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-500/20' }
  }
}
