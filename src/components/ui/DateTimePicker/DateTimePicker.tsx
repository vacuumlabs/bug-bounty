import {DateTime, Duration} from 'luxon'

import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

type DateTimePickerProps = {
  value: Date | null | undefined
  onChange: (value: Date | null) => void
  fromDate?: Date
  toDate?: Date
  zonename?: string
  nullDateText?: string
}

const DateTimePicker = ({
  value,
  onChange,
  fromDate,
  toDate,
  zonename,
  nullDateText,
}: DateTimePickerProps) => {
  const parsedValue = value
    ? DateTime.fromJSDate(value, {zone: zonename})
    : null

  const datePickerValue = parsedValue
    ?.setZone('local', {keepLocalTime: true})
    .toJSDate()

  const timePickerValue =
    parsedValue?.toISOTime({
      includeOffset: false,
    }) ?? ''

  const handleDatePickerChange = (date: Date | undefined) => {
    if (!date) {
      onChange(null)
      return
    }

    const newDate = DateTime.fromJSDate(date)
      .setZone(zonename, {keepLocalTime: true})
      .set({
        hour: parsedValue?.hour,
        minute: parsedValue?.minute,
        second: 0,
        millisecond: 0,
      })
      .toJSDate()

    onChange(newDate)
  }

  const handleTimePickerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newParsedTime = Duration.fromISOTime(event.target.value).toObject()

    const newDate = (parsedValue ?? DateTime.local({zone: zonename}))
      .set({
        hour: newParsedTime.hours,
        minute: newParsedTime.minutes,
        second: 0,
        millisecond: 0,
      })
      .toJSDate()

    onChange(newDate)
  }

  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={datePickerValue}
        onSelect={handleDatePickerChange}
        fromDate={fromDate}
        toDate={toDate}
        nullText={nullDateText}
      />
      <TimePicker
        // take locale date time string in format that the input expects (24hr time)
        value={timePickerValue}
        onChange={handleTimePickerChange}
      />
    </div>
  )
}

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
