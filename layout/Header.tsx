import { Bell, Globe2 } from 'lucide-react'

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="flex h-[82px] items-center justify-end gap-5 px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 md:flex">
          <Globe2 className="h-5 w-5 text-[#1f2863]" />
          <span className="text-sm font-semibold tracking-[0.01em]">ENG</span>
        </div>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center text-[#1f2863]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff8a1a] px-1 text-[10px] font-bold leading-none text-white">
            1
          </span>
        </button>

        <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-white px-4 py-2">
          <div className="text-right leading-tight">
            <p className="text-[15px] font-semibold text-slate-900">Alexander M.</p>
            <p className="text-xs text-slate-500">alexmorgan@gmail.com</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#ff8a1a] bg-slate-100">
            <img
              src="/images/image1.png"
              alt="Alexander M."
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
