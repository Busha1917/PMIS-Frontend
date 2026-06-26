/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type LayoutContextType = {
  breadcrumbSuffix: string | null
  setBreadcrumbSuffix: (suffix: string | null) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [breadcrumbSuffix, setBreadcrumbSuffix] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pmis-dark-mode') === 'true'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pmis-dark-mode', String(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <LayoutContext.Provider
      value={{ breadcrumbSuffix, setBreadcrumbSuffix, darkMode, toggleDarkMode }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
