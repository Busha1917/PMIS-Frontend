import { useEffect, useRef, useState } from 'react'
import type { UserRecord } from '../types'

type UserLookupProps = {
  users: UserRecord[]
  value: string
  selectedId: string | undefined
  onChange: (text: string) => void
  onSelect: (user: UserRecord) => void
  error?: string
  autoFocus?: boolean
  placeholder?: string
}

const inputCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all focus:border-[#161A61] focus:bg-white focus:ring-2 focus:ring-[#161A61]/10'

export function UserLookup({
  users,
  value,
  selectedId,
  onChange,
  onSelect,
  error,
  autoFocus,
  placeholder = 'Search user...',
}: UserLookupProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  // Pre-populate input when selectedId is provided on mount
  useEffect(() => {
    if (selectedId) {
      const match = users.find(u => u.id === selectedId)
      if (match) {
        setQuery(match.name)
      }
    }
    // Only run on mount (or when selectedId / users change from outside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // Sync external `value` prop into local query when it changes externally
  // (e.g. parent clears the field)
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Filter: only active users, case-insensitive substring match on name
  const activeUsers = users.filter(u => u.status === 'Active')
  const filteredUsers =
    query.length >= 2
      ? activeUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
      : []

  // Close dropdown when clicking outside
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  // Reset highlighted index whenever filtered list changes
  useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredUsers.length])

  // Scroll highlighted item into view when navigating with keyboard
  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value
    setQuery(text)
    // Signal to parent that the selected person has been cleared (free-text edit)
    onChange(text)
    // Open dropdown only when ≥2 chars
    setOpen(text.length >= 2)
  }

  function handleSelect(user: UserRecord) {
    setQuery(user.name)
    setOpen(false)
    onSelect(user)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev =>
        filteredUsers.length > 0 ? Math.min(prev + 1, filteredUsers.length - 1) : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredUsers[highlightedIndex]) {
        handleSelect(filteredUsers[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.length >= 2) setOpen(true)
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className={`${inputCls} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />

      {/* Error message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-slate-400">No matching users found</div>
          ) : (
            <ul role="listbox" className="max-h-56 overflow-y-auto">
              {filteredUsers.map((user, idx) => (
                <li
                  key={user.id}
                  ref={el => {
                    itemRefs.current[idx] = el
                  }}
                  role="option"
                  aria-selected={idx === highlightedIndex}
                  onPointerDown={e => {
                    // Prevent input blur before the click registers
                    e.preventDefault()
                    handleSelect(user)
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex cursor-pointer flex-col px-3 py-2.5 text-sm transition-colors ${
                    idx === highlightedIndex
                      ? 'bg-[#161A61] text-white'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span
                    className={`text-xs ${idx === highlightedIndex ? 'text-blue-200' : 'text-slate-400'}`}
                  >
                    {user.position}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
