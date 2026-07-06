import { cn } from '../utils'
import { calculatePasswordStrength, strengthPercentage } from '../utils/helpers'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
}

/**
 * PasswordStrengthIndicator
 * Adapted from Addis Land. Shows a strength bar + checklist for any password field.
 */
export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password)
  const pct = strengthPercentage(strength.score)

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Password Strength</span>
          <span
            className={cn(
              'text-xs font-semibold',
              strength.score < 1
                ? 'text-red-600'
                : strength.score < 2
                  ? 'text-red-500'
                  : strength.score < 3
                    ? 'text-yellow-600'
                    : strength.score < 4
                      ? 'text-blue-600'
                      : 'text-emerald-600'
            )}
          >
            {strength.label}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={cn('h-1.5 rounded-full transition-all duration-300', strength.color)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && password.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { key: 'length', label: '8+ characters' },
            { key: 'lowercase', label: 'Lowercase letter' },
            { key: 'uppercase', label: 'Uppercase letter' },
            { key: 'number', label: 'Number' },
            { key: 'special', label: 'Special character' },
          ].map(({ key, label }) => {
            const met = strength.requirements[key as keyof typeof strength.requirements]
            return (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-1.5 text-xs',
                  met ? 'text-emerald-600' : 'text-slate-400'
                )}
              >
                {met ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <X className="h-3 w-3 text-slate-400" />
                )}
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
