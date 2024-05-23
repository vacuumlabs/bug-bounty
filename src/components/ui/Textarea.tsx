import {TextareaHTMLAttributes, forwardRef} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & object

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-grey-20 bg-white px-3 py-2 text-sm text-black ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export {Textarea}
