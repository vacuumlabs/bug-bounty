import {HTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div
      ref={ref}
      className={cn(
        'border border-grey-20 bg-grey-90 text-grey-20 shadow-sm',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export default Card
