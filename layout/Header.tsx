import { Bell, Globe2, Menu } from 'lucide-react'
import { Button } from '../ui'

type HeaderProps = {
  title?: string
}

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" iconOnly className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <div className="hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-700 md:flex">
          <Globe2 className="h-4 w-4" />
          <span className="text-sm font-semibold">ENG</span>
        </div>
        <Button variant="ghost" iconOnly>
          <Bell className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2 sm:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Alexander M.</p>
            <p className="text-xs text-slate-500">alexmorgan@gmail.com</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300" />
        </div>
      </div>
    </header>
  )
}
