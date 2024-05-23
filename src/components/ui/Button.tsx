import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'
import {ButtonHTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold uppercase ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-90 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-12 px-4 py-3',
        icon: 'h-10 w-10',
      },
      variant: {
        default: 'bg-white text-black hover:bg-grey-20/90',
        destructive: 'text-grey-100 bg-red hover:bg-red/90',
        outline: 'border-2 border-white bg-transparent hover:bg-grey-10',
        secondary: 'bg-white/10',
        ghost: 'hover:bg-white/10',
        link: 'h-fit px-0 font-normal underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = {
  asChild?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {className, variant, size, asChild = false, type = 'button', ...props},
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export {Button, buttonVariants}
