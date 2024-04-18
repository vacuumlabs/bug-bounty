import {ellipsizeText} from '../common/format'

import {FormError} from '@/lib/types/error'
import {toast} from '@/components/ui/Toast'

export const handleGeneralError = (error: Error | undefined) => {
  console.error(error)

  if (error instanceof FormError) {
    // Should be handled by the form
    return
  }

  toast({
    title: 'Uh oh! Something went wrong.',
    description: error ? ellipsizeText(error.message, 100) : undefined,
  })
}
