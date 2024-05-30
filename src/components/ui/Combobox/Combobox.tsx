'use client'

import {Check, ChevronDown, ChevronUp} from 'lucide-react'
import {ReactNode, Ref, useState} from 'react'

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
import {genericForwardRef} from '@/lib/utils/common/react'

export type CommonComboboxProps<T extends string> = {
  className?: string
  emptyListText?: string
  placeholder?: string
  searchPlaceholder?: string
  renderValue?: (value: string | null | undefined) => ReactNode
  value: T | null | undefined
  onBlur?: () => void
  onChange: (value: T | null) => void
}

export type ComboboxProps<T extends string = string> = {
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

const Combobox = <T extends string>(
  {
    className,
    emptyListText = 'No items found.',
    isLoading,
    renderValue = (value) => value,
    options,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    searchQuery,
    setSearchQuery,
    shouldFilter,
    value,
    onBlur,
    onChange,
  }: ComboboxProps<T>,
  ref: Ref<HTMLButtonElement>,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string>()

  const onSelect = (newValue: string) => {
    onChange(newValue === value ? null : (newValue as T))

    const label = getLabelForValue(options, newValue)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  const ChevronIcon = isOpen ? ChevronUp : ChevronDown

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            'flex w-[320px] justify-between border p-3 font-normal normal-case',
            className,
          )}>
          {renderValue(
            value
              ? selectedLabel ?? getLabelForValue(options, value)
              : placeholder,
          )}
          <ChevronIcon className="ml-auto shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent onBlur={onBlur} className="w-[320px] p-0">
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

export default genericForwardRef(Combobox)
