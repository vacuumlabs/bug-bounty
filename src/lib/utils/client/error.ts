import {ellipsizeText} from '../common/format'

import {toast} from '@/components/ui/Toast'

export const handleGeneralError = (error: Error | undefined) => {
  console.error(error)
  toast({
    title: 'Uh oh! Something went wrong.',
    description: error ? ellipsizeText(error.message, 100) : undefined,
  })
}
