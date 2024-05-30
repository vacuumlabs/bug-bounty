import {ChangeEventHandler} from 'react'

import {Input} from '../Input'

type TimePickerProps = {
  value: string | undefined
  onChange: ChangeEventHandler<HTMLInputElement>
}

const TimePicker = ({value, onChange}: TimePickerProps) => {
  return (
    <Input
      type="time"
      className="h-12 w-fit hover:border-grey-10 disabled:border-grey-20 disabled:text-grey-20 aria-disabled:border-grey-20 aria-disabled:text-grey-20"
      value={value ?? ''}
      onChange={onChange}
      style={{colorScheme: 'dark'}}
    />
  )
}

export default TimePicker
