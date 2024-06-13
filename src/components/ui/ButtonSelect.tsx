import {ReactNode} from 'react'

import {Button} from './Button'
import {Tooltip, TooltipArrow, TooltipContent, TooltipTrigger} from './Tooltip'

import {cn} from '@/lib/utils/client/tailwind'
import {SelectOption} from '@/lib/utils/common/enums'

type ButtonSelectOption<T extends string> = SelectOption<T> & {
  tooltipContent?: ReactNode
}

export type ButtonSelectProps<T extends string = string> = {
  className?: string
  options: ButtonSelectOption<T>[]
  value: T | null | undefined
  onChange: (value: T) => void
}

const ButtonSelect = <T extends string>({
  className,
  options,
  value,
  onChange,
}: ButtonSelectProps<T>) => {
  return (
    <div className={cn('flex gap-3', className)}>
      {options.map((option) =>
        option.tooltipContent ? (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <Button
                key={option.value}
                variant={value === option.value ? 'default' : 'outline'}
                onClick={() => onChange(option.value)}>
                {option.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={16}>
              {option.tooltipContent}
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'outline'}
            onClick={() => onChange(option.value)}>
            {option.label}
          </Button>
        ),
      )}
    </div>
  )
}

export default ButtonSelect
