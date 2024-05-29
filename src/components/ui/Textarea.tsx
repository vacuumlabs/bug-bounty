import {TextareaHTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'
import {Merge} from '@/lib/types/general'

export type TextareaProps = Merge<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  {value: null}
>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, value: receivedValue, ...props}, ref) => {
    const value = receivedValue === null ? '' : receivedValue

    return (
      <textarea
        className={cn(
          'flex min-h-[150px] w-full border border-white bg-black px-3 py-2 ring-offset-white placeholder:text-grey-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        value={value}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export default Textarea
