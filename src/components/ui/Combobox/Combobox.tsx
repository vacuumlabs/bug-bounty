'use client'

import {Check, ChevronsUpDown} from 'lucide-react'
import {useState} from 'react'

import {cn} from '@/lib/utils/client/tailwind'
import {Button} from '@/components/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/Command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/Popover'
import {SelectOption} from '@/lib/utils/common/enums'

export type CommonComboboxProps<T extends string> = {
  className?: string
  emptyListText?: string
  placeholder?: string
  searchPlaceholder?: string
  value: T | undefined
  onChange: (value: T | undefined) => void
}

type ComboboxProps<T extends string> = {
  isLoading?: boolean
  options: SelectOption<T>[]
  searchQuery?: string
  setSearchQuery?: (value: string) => void
  shouldFilter?: boolean
} & CommonComboboxProps<T>

const getLabelForValue = (options: SelectOption[], value: string) => {
  const option = options.find((option) => option.value === value)
  return option?.label
}

const Combobox = <T extends string>({
  className,
  emptyListText = 'No items found.',
  isLoading,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  searchQuery,
  setSearchQuery,
  shouldFilter,
  value,
  onChange,
}: ComboboxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string>()

  const onSelect = (newValue: string) => {
    onChange(newValue === value ? undefined : (newValue as T))

    const label = getLabelForValue(options, newValue)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn('flex w-[200px] justify-between', className)}>
          {value
            ? selectedLabel ?? getLabelForValue(options, value)
            : placeholder}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty>{emptyListText}</CommandEmpty>
            <CommandGroup>
              {isLoading && <CommandLoading>Loading…</CommandLoading>}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={onSelect}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
