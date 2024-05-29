'use client'

import {Command as CommandPrimitive} from 'cmdk'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({className, ...props}, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden bg-black text-white',
      className,
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

export default Command
