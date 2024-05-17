'use client'

import {ChangeEvent, forwardRef} from 'react'
import {DateTime} from 'luxon'

import {Input, InputProps} from './Input'

import {cn} from '@/lib/utils/client/tailwind'
import {Override} from '@/lib/types/general'

type DateTimeInputProps = Override<
  InputProps,
  {
    value: Date | null | undefined
    onChange: (value: Date | null) => void
    zonename?: string
  }
>

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  (
    {
      value,
      onChange,
      type = 'datetime-local',
      zonename = DateTime.local().zoneName,
      className,
      ...props
    },
    ref,
  ) => {
    const inputValue = value
      ? DateTime.fromJSDate(value, {zone: zonename}).toISO({
          includeOffset: false,
        })
      : null

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (value === '') {
        onChange(null)
      } else {
        onChange(DateTime.fromISO(value, {zone: zonename}).toJSDate())
      }
    }

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        type={type}
        className={cn('w-fit', className)}
        suppressHydrationWarning
        {...props}
      />
    )
  },
)
DateTimeInput.displayName = 'DateTimeInput'

export default DateTimeInput
