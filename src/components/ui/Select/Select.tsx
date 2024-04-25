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
  onValueChange?: (value: T) => void
} & RadixSelectProps

const Select = <T extends string>({
  className,
  options,
  placeholder,
  ...rootProps
}: SelectProps<T>) => {
  return (
    <SelectRoot {...rootProps}>
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
