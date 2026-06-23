type PageHeaderCardProps = {
  title: string
  subtitle: string
}

export function PageHeaderCard({ title, subtitle }: PageHeaderCardProps) {
  return (
    <div className="mb-3">
      <div className="max-w-2xl">
        <p className="header-font text-xl font-semibold tracking-[-0.01em] text-slate-950">{title}</p>
        <p className="header-font mt-2 text-sm text-slate-600">{subtitle}</p>
      </div>
    </div>
  )
}
