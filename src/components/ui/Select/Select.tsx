'use client'

import {SelectProps as RadixSelectProps} from '@radix-ui/react-select'
import {Ref} from 'react'

import {SelectRoot, SelectValue} from './primitives'
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
    return (
      <SelectRoot
        value={value === null ? '' : value}
        onValueChange={onChange}
        {...rootProps}>
        <SelectTrigger
          onBlur={onBlur}
          ref={ref}
          className={cn('w-[180px]', className)}>
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
  },
)

export default Select
