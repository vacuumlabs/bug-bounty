'use client'

import {HTMLAttributes} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const CommandShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-slate-500',
        className,
      )}
      {...props}
    />
  )
}

CommandShortcut.displayName = 'CommandShortcut'

export default CommandShortcut
