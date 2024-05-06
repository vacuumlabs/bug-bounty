'use client'

import {SelectProps as RadixSelectProps} from '@radix-ui/react-select'

import {SelectRoot, SelectValue} from './primitives'
import SelectTrigger from './SelectTrigger'
import SelectContent from './SelectContent'
import SelectItem from './SelectItem'

import {SelectOption} from '@/lib/utils/common/enums'
import {cn} from '@/lib/utils/client/tailwind'

type SelectProps<T extends string> = {
  className?: string
  options: SelectOption<T>[]
  placeholder?: string
  value?: T | null
  defaultValue?: T
  onValueChange?: (value: T) => void
} & Omit<RadixSelectProps, 'value' | 'defaultValue' | 'onValueChange'>

const Select = <T extends string>({
  className,
  options,
  placeholder,
  value,
  ...rootProps
}: SelectProps<T>) => {
  return (
    <SelectRoot
      value={value === null ? '' : value}
      {...(rootProps as RadixSelectProps)}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder={placeholder} />
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
}

export default Select
