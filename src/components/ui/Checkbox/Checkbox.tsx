'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'
import {Check} from 'lucide-react'

import {cn} from '@/lib/utils/client/tailwind'

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-6 w-6 shrink-0 border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export default Checkbox
