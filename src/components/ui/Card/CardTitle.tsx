import {HTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({className, children, ...props}, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}>
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

export default CardTitle
