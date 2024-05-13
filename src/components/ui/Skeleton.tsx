import {HTMLAttributes} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Skeleton = ({className, ...props}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-800',
      className,
    )}
    {...props}
  />
)

export default Skeleton
