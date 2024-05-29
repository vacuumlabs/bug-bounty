import {DateTime} from 'luxon'

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
  const inputValue = value
    ? DateTime.fromJSDate(value, {zone: zonename}).toJSDate()
    : null

  const handleChange = (value: Date | null | undefined) => {
    if (value) {
      onChange(DateTime.fromJSDate(value, {zone: zonename}).toJSDate())
    } else {
      onChange(null)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={inputValue}
        onSelect={handleChange}
        fromDate={fromDate}
        toDate={toDate}
        nullText={nullDateText}
      />
      <TimePicker
        // take locale date time string in format that the input expects (24hr time)
        value={inputValue?.toLocaleTimeString([], {
          hourCycle: 'h23',
          hour: '2-digit',
          minute: '2-digit',
        })}
        // take hours and minutes and update our Date object then change date object to our new value
        onChange={(selectedTime) => {
          const currentTime = value
          currentTime?.setHours(
            Number.parseInt(selectedTime.target.value.split(':')[0] ?? ''),
            Number.parseInt(selectedTime.target.value.split(':')[1] ?? ''),
            0,
          )
          handleChange(currentTime)
        }}
      />
    </div>
  )
}

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
