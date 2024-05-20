'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'
import {Override} from '@/lib/types/general'

const TabsRoot = TabsPrimitive.Root

type TabsProps<T extends string> = Override<
  TabsPrimitive.TabsProps,
  {
    value?: T
    defaultValue?: T
    onValueChange?: (value: T) => void
  }
>

const Tabs = <T extends string>({...props}: TabsProps<T>) => (
  <TabsRoot {...(props as TabsPrimitive.TabsProps)} />
)

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md p-1',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({className, ...props}, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm border-b-2 border-transparent px-4 py-2.5 text-sm font-medium uppercase ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-current data-[state=active]:font-semibold data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent}
