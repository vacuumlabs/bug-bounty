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
    ? DateTime.fromJSDate(value).setZone(zonename).toJSDate()
    : null

  const handleChange = (value: Date | null | undefined) => {
    if (value) {
      onChange(DateTime.fromJSDate(value, {zone: zonename}).toUTC().toJSDate())
    } else {
      onChange(null)
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) return

    const [hours, minutes] = event.target.value.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return

    const dateTimeInUserZone = DateTime.fromJSDate(value, {
      zone: zonename,
    }).set({
      hour: hours,
      minute: minutes,
      second: 0,
    })

    handleChange(dateTimeInUserZone.toJSDate())
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
        value={
          inputValue
            ? DateTime.fromJSDate(inputValue)
                .setZone(zonename)
                .toFormat('HH:mm')
            : undefined
        }
        // take hours and minutes and update our Date object then change date object to our new value
        onChange={handleTimeChange}
      />
    </div>
  )
}

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
