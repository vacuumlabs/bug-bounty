import {cva, type VariantProps} from 'class-variance-authority'
import {HTMLAttributes} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const badgeVariants = cva(
  'inline-flex text-black items-center border border-transparent rounded-full px-2 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-slate-50 hover:bg-slate-900/80',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        destructive: 'bg-red text-slate-50 hover:bg-red',
        green: 'bg-green',
        sky: 'bg-sky',
        blue: 'bg-blue',
        outline: 'border-white text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>

const Badge = ({className, variant, ...props}: BadgeProps) => (
  <div className={cn(badgeVariants({variant}), className)} {...props} />
)

export {Badge, badgeVariants}
