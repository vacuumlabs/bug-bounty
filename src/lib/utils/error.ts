import {ellipsizeText} from './format'

import {toast} from '@/components/ui/Toast'

export const handleGeneralError = (error: Error) => {
  console.error(error)
  toast({
    title: 'Uh oh! Something went wrong.',
    description: ellipsizeText(error.message, 100),
  })
}
