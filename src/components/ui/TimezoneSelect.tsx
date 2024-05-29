import {DateTime} from 'luxon'
import {Ref, forwardRef} from 'react'
import {Globe} from 'lucide-react'

import Combobox, {type ComboboxProps} from './Combobox/Combobox'
import NoSSR from '../helpers/NoSsr'

type TimezoneSelectProps = Omit<ComboboxProps, 'options' | 'renderValue'>

const options = Intl.supportedValuesOf('timeZone').map((zone) => ({
  value: zone,
  label: `${zone} ${DateTime.local({zone}).toFormat('Z')}`,
}))

const TimezoneSelect = (
  {className, ...props}: TimezoneSelectProps,
  ref: Ref<HTMLButtonElement>,
) => {
  return (
    <Combobox
      ref={ref}
      options={options}
      {...props}
      renderValue={(value) => (
        <NoSSR>
          <Globe className="mr-2" />
          {value}
        </NoSSR>
      )}
    />
  )
}

export default forwardRef(TimezoneSelect)
