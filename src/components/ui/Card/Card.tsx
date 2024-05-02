import {HTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export default Card
