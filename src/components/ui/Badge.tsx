import {cva, type VariantProps} from 'class-variance-authority'
import {HTMLAttributes} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-transparent px-2 py-1 text-sm text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-slate-50 hover:bg-grey-90/80',
        secondary: 'bg-grey-10 text-grey-90 hover:bg-grey-10/80',
        destructive: 'bg-red text-slate-50 hover:bg-red',
        green: 'bg-green',
        sky: 'bg-blue',
        blue: 'bg-purple',
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
