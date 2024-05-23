import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'
import {ButtonHTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap uppercase ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-90 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-grey-60 aria-disabled:pointer-events-none aria-disabled:text-grey-60',
  {
    variants: {
      size: {
        small: 'h-10 px-4 py-3 text-buttonS',
        medium: 'h-12 px-4 py-3 text-buttonM',
        large: 'h-14 px-4 py-3 text-buttonL',
        icon: 'h-10 w-10',
      },
      variant: {
        default:
          'border-2 border-transparent bg-white text-black hover:bg-grey-10 active:border-white aria-disabled:bg-grey-20 aria-disabled:bg-grey-20',
        purple:
          'border-2 border-transparent bg-purple text-black hover:bg-purple-dark active:border-white aria-disabled:bg-purple-light aria-disabled:bg-purple-light',
        outline:
          'border-2 border-white bg-transparent text-white hover:border-grey-10 active:-mx-[1px] active:border-[3px] active:border-white disabled:border-grey-20 disabled:text-grey-20 aria-disabled:border-grey-20 aria-disabled:text-grey-20',
        link: 'h-fit px-0 font-normal underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
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
