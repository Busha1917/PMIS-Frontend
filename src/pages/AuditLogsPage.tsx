import { useMemo, useState } from 'react'
import { DataTable } from '../components/DataTable'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { PageToolbar } from '../components/PageToolbar'
import type { AuditLogRecord } from '../types'
import { auditLogs as initialLogs } from '../data'
import { timeAgo } from '../utils/helpers'

export function AuditLogsPage() {
  const [logs] = useState<AuditLogRecord[]>(initialLogs)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          log.action.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query) ||
          log.user.toLowerCase().includes(query) ||
          log.details.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [logs, searchQuery])

  const isFiltering = searchQuery !== ''

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'text-emerald-600 bg-emerald-50 ring-emerald-500/20'
      case 'update':
        return 'text-blue-600 bg-blue-50 ring-blue-500/20'
      case 'delete':
        return 'text-red-600 bg-red-50 ring-red-500/20'
      case 'login':
        return 'text-purple-600 bg-purple-50 ring-purple-500/20'
      default:
        return 'text-slate-600 bg-slate-50 ring-slate-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard title="Audit Logs" subtitle="Track system events and user activity." />
      <PageToolbar
        searchPlaceholder="Search logs by action, user, or details..."
        onSearch={setSearchQuery}
        showSearchAndFilters={true}
      />

      <DataTable
        items={filteredLogs}
        rowKey={log => log.id}
        emptyVariant={isFiltering ? 'search' : 'empty'}
        columns={[
          {
            label: 'Timestamp',
            render: log => (
              <div>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="ml-2 text-xs text-slate-400">{timeAgo(log.timestamp)}</span>
              </div>
            ),
            headClassName: 'bg-[#0b265a] text-white w-48',
          },
          {
            label: 'User',
            render: log => <span className="font-medium text-slate-900">{log.user}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
          {
            label: 'Action',
            render: log => (
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getActionColor(
                  log.action
                )}`}
              >
                {log.action}
              </span>
            ),
            headClassName: 'bg-[#0b265a] text-white w-32',
          },
          {
            label: 'Module',
            render: log => <span className="text-slate-600 font-medium">{log.module}</span>,
            headClassName: 'bg-[#0b265a] text-white w-32',
          },
          {
            label: 'Details',
            render: log => <span className="text-slate-600">{log.details}</span>,
            headClassName: 'bg-[#0b265a] text-white',
          },
        ]}
      />
    </div>
  )
}
