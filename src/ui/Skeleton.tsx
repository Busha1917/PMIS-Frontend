import type { HTMLAttributes } from 'react'
import { cn } from '../utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100 dark:bg-slate-800', className)}
      {...props}
    />
  )
}

export default Skeleton
