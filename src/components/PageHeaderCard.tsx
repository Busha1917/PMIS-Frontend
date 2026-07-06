import { cn } from '../utils'

type PageHeaderCardProps = {
  title: string
  subtitle: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeaderCard({ title, subtitle, actions }: PageHeaderCardProps) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between animate-fadeInUp">
      <div className="max-w-2xl">
        <p className="header-font text-xl font-bold tracking-[-0.01em] text-slate-950">{title}</p>
        <p className="header-font mt-1.5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
