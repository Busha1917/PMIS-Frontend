import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  Trash2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { PageHeaderCard } from '../components/PageHeaderCard'
import { Button } from '../ui'
import { notifications as initialNotifications } from '../data'
import type { NotificationRecord } from '../types'
import { toast } from 'sonner'
import { cn } from '../utils'

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationRecord[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = items.filter(n => !n.isRead).length
  const displayedItems = items.filter(n => (filter === 'unread' ? !n.isRead : true))

  const handleMarkAllRead = () => {
    setItems(current => current.map(item => ({ ...item, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const handleMarkRead = (id: string) => {
    setItems(current => current.map(item => (item.id === id ? { ...item, isRead: true } : item)))
  }

  const handleDelete = (id: string) => {
    setItems(current => current.filter(item => item.id !== id))
    toast.error('Notification removed')
  }

  const getIcon = (type: NotificationRecord['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[#ff9500]" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Notification Center"
        subtitle="Manage your alerts and stay up to date with system activities."
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                filter === 'all'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2',
                filter === 'unread'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-[#ff9500] px-2 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <Bell className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900">All caught up!</h3>
              <p className="text-sm text-slate-500">
                You have no {filter === 'unread' ? 'unread ' : ''}notifications at this time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayedItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    'group relative flex items-start gap-4 p-4 sm:px-6 transition-colors hover:bg-slate-50',
                    !item.isRead ? 'bg-blue-50/30' : ''
                  )}
                >
                  <div className="mt-1 flex-shrink-0">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4
                          className={cn(
                            'text-sm',
                            !item.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                          )}
                        >
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.message}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          {item.link && (
                            <a
                              href={item.link}
                              className="inline-flex items-center gap-1 text-[#0b265a] hover:text-[#ff9500] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkRead(item.id)}
                        className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0b265a] transition"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!item.isRead && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-1 bg-[#ff9500]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
