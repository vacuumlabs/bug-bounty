'use client'

import {ArrowUpDown} from 'lucide-react'
import {useState} from 'react'

import {Button} from '../Button'
import {Popover, PopoverContent, PopoverTrigger} from '../Popover'

import {SortOption, SortParams} from '@/lib/utils/common/sorting'
import {cn} from '@/lib/utils/client/tailwind'

type SortControlsProps<T extends string> = {
  options: SortOption<T>[]
  setSortParams: (sortParams: SortParams<T>) => void
  sortParams: SortParams<T> | undefined
}

const SortControls = <T extends string>({
  options,
  setSortParams,
  sortParams,
}: SortControlsProps<T>) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const onValueChange = (params: SortParams<T>) => {
    setSortParams(params)
    setIsPopupOpen(false)
  }

  const isSelected = (params: SortParams<T>) =>
    params.field === sortParams?.field &&
    params.direction === sortParams.direction

  return (
    <Popover open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="small"
          className={'flex w-fit justify-between gap-2'}>
          {'Sort by'}
          <ArrowUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] px-0 py-2">
        <ul>
          {options.map(({direction, field, labels}) => (
            <li key={`${field}-${direction}`}>
              <button
                onClick={() => onValueChange({field, direction})}
                className={cn(
                  'flex w-full cursor-pointer justify-between px-4 py-2 hover:bg-grey-90',
                  isSelected({field, direction}) && 'bg-grey-90',
                )}>
                <span className="text-grey-40">{labels[0]}</span>
                <span>{labels[1]}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default SortControls
