import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
  useId,
} from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import Checkbox from './Checkbox'

import {cn} from '@/lib/utils/client/tailwind'

type CheckboxWithLabelProps = {
  label: ReactNode
} & ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const CheckboxWithLabel = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({className, label, id, ...checkboxProps}, ref) => {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Checkbox ref={ref} {...checkboxProps} id={checkboxId} />
      <label className="Label" htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  )
})
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

export default CheckboxWithLabel
