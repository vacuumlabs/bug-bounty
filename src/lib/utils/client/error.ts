import {fromZodError} from 'zod-validation-error'
import {ZodError} from 'zod'

import {ellipsizeText} from '../common/format'

import {FormError, ZodFormError} from '@/lib/types/error'
import {toast} from '@/components/ui/Toast'

const getToastErrorMessage = (error: Error | undefined) => {
  if (error instanceof ZodError) {
    return fromZodError(error).message
  }

  return error ? ellipsizeText(error.message, 100) : undefined
}

export const handleGeneralError = (error: Error | undefined) => {
  console.error(error)

  if (error instanceof FormError || error instanceof ZodFormError) {
    // Should be handled by the form
    return
  }

  toast({
    title: 'Uh oh! Something went wrong.',
    description: getToastErrorMessage(error),
  })
}
