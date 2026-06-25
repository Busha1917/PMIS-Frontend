import { Building2, Layers, FolderOpen } from 'lucide-react'
import { Button, Card, CardContent } from '../ui'
import { baseData } from '../data'

const iconMap: Record<string, React.ReactNode> = {
  'base-001': (
    <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-xl bg-[#161A61]/10">
      <Building2 className="h-7 w-7 text-[#161A61]" />
    </div>
  ),
  'base-002': (
    <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-xl bg-[#161A61]/10">
      <Layers className="h-7 w-7 text-[#161A61]" />
    </div>
  ),
  'base-003': (
    <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-xl bg-[#161A61]/10">
      <FolderOpen className="h-7 w-7 text-[#161A61]" />
    </div>
  ),
}

export function BaseDataPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Base Data</h1>
        <p className="mt-1 text-sm text-slate-500">Register and manage base data.</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {baseData.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="flex items-center gap-4 py-5">
              {/* Icon */}
              {iconMap[item.id] ?? (
                <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-xl bg-[#161A61]/10">
                  <Layers className="h-7 w-7 text-[#161A61]" />
                </div>
              )}

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-slate-500 leading-snug">{item.description}</p>
              </div>

              {/* View Button */}
              <Button className="flex-shrink-0 bg-[#FF9500] hover:bg-[#e08600] text-white font-medium px-5 py-2 rounded-lg">
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
