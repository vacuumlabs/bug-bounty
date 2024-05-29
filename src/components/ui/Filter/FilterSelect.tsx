import {CheckboxGroup} from '../Checkbox'

import {SelectOption} from '@/lib/utils/common/enums'

export type FilterSelectProps<T extends string = string> = {
  label: string
  options: SelectOption<T>[]
  values: T[]
  onChange: (values: T[]) => void
}

const FilterSelect = <T extends string>({
  label,
  options,
  values,
  onChange,
}: FilterSelectProps<T>) => {
  return (
    <div className="flex flex-col gap-4">
      <span>{label}</span>
      <CheckboxGroup
        options={options}
        className="flex-row flex-wrap gap-3"
        value={values}
        onChange={onChange}
      />
    </div>
  )
}

export default FilterSelect
