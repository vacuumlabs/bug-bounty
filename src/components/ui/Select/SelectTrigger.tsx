'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-12 w-full items-center justify-between border border-white bg-black px-3 py-2 ring-transparent ring-offset-white placeholder:text-grey-20 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:outline-none data-[state=open]:ring-2 data-[state=open]:ring-offset-2 [&>span]:line-clamp-1',
      className,
    )}
    {...props}>
    {children}
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export default SelectTrigger
