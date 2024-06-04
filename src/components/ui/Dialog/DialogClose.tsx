import * as DialogPrimitive from '@radix-ui/react-dialog'
import {X} from 'lucide-react'

import {cn} from '@/lib/utils/client/tailwind'

type DialogCloseProps = {
  className?: string
}

const DialogClose = ({className}: DialogCloseProps) => (
  <DialogPrimitive.Close
    className={cn(
      'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-grey-10 data-[state=open]:text-grey-40',
      className,
    )}>
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
)

export default DialogClose
