import CheckboxWithLabel from './CheckboxWithLabel'

import {SelectOption} from '@/lib/utils/common/enums'
import {cn} from '@/lib/utils/client/tailwind'

type CheckboxGroupProps<T extends string> = {
  className?: string
  checkboxClassName?: string
  disabled?: boolean
  name?: string
  options: SelectOption<T>[]
  value: T[] | null | undefined
  onChange: (newValue: T[]) => void
  onBlur?: () => void
}

const CheckboxGroup = <T extends string>({
  className,
  checkboxClassName,
  disabled,
  name,
  options,
  value: receivedValue,
  onBlur,
  onChange,
}: CheckboxGroupProps<T>) => {
  const value = receivedValue ?? []

  const toggleValue = (valueToToggle: T) =>
    value.includes(valueToToggle)
      ? onChange(value.filter((v) => v !== valueToToggle))
      : onChange([...value, valueToToggle])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {options.map((option) => (
        <CheckboxWithLabel
          key={option.value}
          className={checkboxClassName}
          disabled={disabled}
          checked={value.includes(option.value)}
          label={option.label}
          name={name}
          onBlur={onBlur}
          onCheckedChange={() => toggleValue(option.value)}
        />
      ))}
    </div>
  )
}

export default CheckboxGroup
