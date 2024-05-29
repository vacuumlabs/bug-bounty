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
      className="h-12 w-28 border-2 border-white bg-transparent text-white hover:border-grey-10 active:-mx-[1px] active:border-[3px] active:border-white disabled:border-grey-20 disabled:text-grey-20 aria-disabled:border-grey-20 aria-disabled:text-grey-20"
      value={value ?? ''}
      onChange={onChange}
    />
  )
}

export default TimePicker
