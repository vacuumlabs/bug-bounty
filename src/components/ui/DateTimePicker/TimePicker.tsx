import {ChangeEventHandler} from 'react'

import {Input} from '../Input'

type TimePickerProps = {
  defaultValue: string | undefined
  onChange: ChangeEventHandler<HTMLInputElement>
}

const TimePicker = ({defaultValue, onChange}: TimePickerProps) => {
  return (
    <Input
      type="time"
      className="h-12 w-[105px] hover:border-grey-10 disabled:border-grey-20 disabled:text-grey-20 aria-disabled:border-grey-20 aria-disabled:text-grey-20"
      defaultValue={defaultValue}
      onChange={onChange}
      style={{colorScheme: 'dark'}}
    />
  )
}

export default TimePicker
