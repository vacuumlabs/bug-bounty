'use client'

import * as React from 'react'
import {format} from 'date-fns'
import {Calendar as CalendarIcon} from 'lucide-react'
import {SelectSingleEventHandler} from 'react-day-picker'

import {Button} from '../Button'
import {Popover, PopoverContent, PopoverTrigger} from '../Popover'

import {Calendar} from '@/components/ui/calendar'
import {cn} from '@/lib/utils/client/tailwind'

type DatePickerProps = {
  selected: Date | null | undefined
  onSelect: SelectSingleEventHandler
  fromDate?: Date
  toDate?: Date
  nullText?: string
}

const DatePicker = ({
  selected,
  onSelect,
  fromDate,
  toDate,
  nullText,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, 'PPP')
          ) : (
            <span>{nullText ?? 'Pick a Date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={onSelect}
          initialFocus
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
