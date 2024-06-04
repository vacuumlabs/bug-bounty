'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Popover = PopoverPrimitive.Root
const PopoverPortal = PopoverPrimitive.Portal

const PopoverTrigger = forwardRef<
  ElementRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({className, ...props}, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn(
      'ring-transparent ring-offset-white data-[state=open]:outline-none data-[state=open]:ring-2 data-[state=open]:ring-offset-2',
      className,
    )}
    {...props}
  />
))
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({className, align = 'center', sideOffset = 4, ...props}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 border-2 border-white bg-black p-4 text-white shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export {Popover, PopoverPortal, PopoverTrigger, PopoverContent}
