import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../ui'
import { baseData } from '../data'

export function BaseDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Register and manage base data.</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">View</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {baseData.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="space-y-4">
              <div className="text-slate-950 text-base font-semibold">{item.title}</div>
              <div className="text-sm text-slate-500">{item.description}</div>
              <Button className="bg-orange-500 hover:bg-orange-600">View</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
