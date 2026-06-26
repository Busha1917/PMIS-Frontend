/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type LayoutContextType = {
  breadcrumbSuffix: string | null
  setBreadcrumbSuffix: (suffix: string | null) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [breadcrumbSuffix, setBreadcrumbSuffix] = useState<string | null>(null)

  return (
    <LayoutContext.Provider value={{ breadcrumbSuffix, setBreadcrumbSuffix }}>
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
