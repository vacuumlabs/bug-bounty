import {ZodError, ZodIssue} from 'zod'

import {FormError, FormErrorData, ZodFormError} from '@/lib/types/error'

export const API_FORM_ERROR_FLAG = 'api-form-error'
export const API_ZOD_ERROR_FLAG = 'api-zod-error'

export type ApiFormError<Data extends FormErrorData = undefined> = {
  type: typeof API_FORM_ERROR_FLAG
  message: string
  data?: Data
}

export type ApiZodError = {
  type: typeof API_ZOD_ERROR_FLAG
  issues: ZodIssue[]
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

export const getApiZodError = (error: ZodError): ApiZodError => ({
  type: API_ZOD_ERROR_FLAG,
  issues: error.issues,
})

const isApiZodError = (obj: unknown): obj is ApiZodError =>
  typeof obj === 'object' &&
  obj !== null &&
  'type' in obj &&
  obj.type === API_ZOD_ERROR_FLAG

/**
 * Function to parse server action return data and throw an error if it's an error object.
 *
 * @param result - Data returned from a server action call
 * @param shouldFormHandleZodErrors - Disables the general error handling (error toast) in case Zod errors should be handled inside a form
 * @returns Same data as passed in or throws an error
 */
export const handleApiErrors = <
  Result extends object,
  ErrorData extends FormErrorData,
>(
  result: Result | ApiFormError<ErrorData> | ApiZodError,
  shouldFormHandleZodErrors?: boolean,
): Result => {
  if (isApiFormError(result)) {
    throw new FormError(result.message, result.data)
  }

  if (isApiZodError(result)) {
    throw shouldFormHandleZodErrors
      ? new ZodFormError(result.issues)
      : new ZodError(result.issues)
  }

  return result
}

/**
 * Convenience function to wrap a server action callback and handle any errors that are returned.
 *
 * @param action - Server action or a function that calls one
 * @param shouldFormHandleZodErrors - Disables the general error handling (error toast) in case Zod errors should be handled inside a form
 * @returns Result of the action callback
 */
export const withApiErrorHandler =
  <
    Args extends unknown[],
    Result extends object,
    ErrorData extends FormErrorData,
  >(
    action: (
      ...args: Args
    ) => Promise<Result | ApiFormError<ErrorData> | ApiZodError>,
    shouldFormHandleZodErrors?: boolean,
  ) =>
  async (...args: Args) => {
    const result = await action(...args)

    return handleApiErrors(result, shouldFormHandleZodErrors)
  }
