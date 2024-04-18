import {FormError, FormErrorData} from '@/lib/types/error'

export const API_FORM_ERROR_FLAG = 'api-form-error'

export type ApiFormError<Data extends FormErrorData = undefined> = {
  type: typeof API_FORM_ERROR_FLAG
  message: string
  data?: Data
}

export const getApiFormError = <T extends FormErrorData>(
  message: string,
  data?: T,
): ApiFormError<T> => ({
  type: API_FORM_ERROR_FLAG,
  message,
  data,
})

const isApiFormError = <T extends FormErrorData>(
  obj: unknown,
): obj is ApiFormError<T> =>
  typeof obj === 'object' &&
  obj !== null &&
  'type' in obj &&
  obj.type === API_FORM_ERROR_FLAG

export const handlePossibleFormError = <
  Result extends object,
  ErrorData extends FormErrorData,
>(
  result: Result | ApiFormError<ErrorData>,
): Result => {
  if (isApiFormError(result)) {
    throw new FormError(result.message, result.data)
  }

  return result
}
