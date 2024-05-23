'use client'

import {ComponentPropsWithoutRef, ElementRef, forwardRef} from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import {cn} from '@/lib/utils/client/tailwind'

const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({className, ...props}, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-grey-10', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export default SelectSeparator
