'use client'

import {SelectProps as RadixSelectProps} from '@radix-ui/react-select'
import {Ref, useState} from 'react'
import {ChevronDown, ChevronUp} from 'lucide-react'

import {SelectIcon, SelectRoot, SelectValue} from './primitives'
import SelectTrigger from './SelectTrigger'
import SelectContent from './SelectContent'
import SelectItem from './SelectItem'

import {SelectOption} from '@/lib/utils/common/enums'
import {cn} from '@/lib/utils/client/tailwind'
import {Override} from '@/lib/types/general'
import {genericForwardRef} from '@/lib/utils/common/react'

export type SelectProps<T extends string = string> = Override<
  RadixSelectProps,
  {
    className?: string
    options: SelectOption<T>[]
    placeholder?: string
    value?: T | null
    defaultValue?: T
    onChange?: (value: T) => void
    onBlur?: () => void
  }
>

const Select = genericForwardRef(
  <T extends string>(
    {
      className,
      options,
      placeholder,
      value,
      onChange,
      onBlur,
      ...rootProps
    }: SelectProps<T>,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const [isOpen, setIsOpen] = useState(false)

    const ChevronIcon = isOpen ? ChevronUp : ChevronDown

    return (
      <SelectRoot
        open={isOpen}
        onOpenChange={setIsOpen}
        value={value === null ? '' : value}
        onValueChange={onChange}
        {...rootProps}>
        <SelectTrigger
          onBlur={onBlur}
          ref={ref}
          className={cn('w-full', className)}>
          <SelectValue placeholder={placeholder} />
          <SelectIcon asChild>
            <ChevronIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          {options.map(({value, label}) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    )
  },
)

export default Select
