'use client'

import {Command as CommandPrimitive} from 'cmdk'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({className, ...props}, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
      className,
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

export default CommandItem
