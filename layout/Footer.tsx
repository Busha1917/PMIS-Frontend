export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>Admin Template Starter</p>
        <div className="flex gap-4">
          <a href="#support" className="hover:text-slate-950">
            Support
          </a>
          <a href="#privacy" className="hover:text-slate-950">
            Privacy
          </a>
          <a href="#terms" className="hover:text-slate-950">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
