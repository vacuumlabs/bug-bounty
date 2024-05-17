import {DateTime} from 'luxon'
import {Ref, forwardRef} from 'react'

import Combobox, {type ComboboxProps} from './Combobox/Combobox'

type TimezoneSelectProps = Omit<ComboboxProps, 'options'>

const options = Intl.supportedValuesOf('timeZone').map((zone) => ({
  value: zone,
  label: `${zone} ${DateTime.local({zone}).toFormat('Z')}`,
}))

const TimezoneSelect = (
  {className, ...props}: TimezoneSelectProps,
  ref: Ref<HTMLButtonElement>,
) => {
  return (
    <Combobox options={options} {...props} suppressHydrationWarning ref={ref} />
  )
}

export default forwardRef(TimezoneSelect)
