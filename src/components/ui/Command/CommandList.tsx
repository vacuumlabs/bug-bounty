'use client'

import {Command as CommandPrimitive} from 'cmdk'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({className, ...props}, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

export default CommandList
