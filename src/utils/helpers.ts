export function timeAgo(isoTimestamp: string): string {
  const diff = Date.now() - new Date(isoTimestamp).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  requirements: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const score = Object.values(requirements).filter(Boolean).length

  const label =
    score === 0
      ? 'None'
      : score <= 1
        ? 'Very Weak'
        : score === 2
          ? 'Weak'
          : score === 3
            ? 'Fair'
            : score === 4
              ? 'Strong'
              : 'Very Strong'

  const color =
    score <= 1
      ? 'bg-red-500'
      : score === 2
        ? 'bg-orange-500'
        : score === 3
          ? 'bg-yellow-500'
          : score === 4
            ? 'bg-blue-500'
            : 'bg-emerald-500'

  return { score, label, color, requirements }
}

export function strengthPercentage(score: number): number {
  return (score / 5) * 100
}
