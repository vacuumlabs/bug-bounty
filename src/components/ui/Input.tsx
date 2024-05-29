import {InputHTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'
import {Merge} from '@/lib/types/general'

export type InputProps = Merge<
  InputHTMLAttributes<HTMLInputElement>,
  {
    value: null
  }
>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, type, value: receivedValue, ...props}, ref) => {
    const value = receivedValue === null ? '' : receivedValue

    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full border border-white bg-black px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grey-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        value={value}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export {Input}
