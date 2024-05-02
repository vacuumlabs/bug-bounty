import {ZodError, ZodIssue} from 'zod'

export type FormErrorData = Record<string, unknown> | undefined

export class FormError<T extends FormErrorData> extends Error {
  public data: T | undefined
  constructor(message: string, data?: T) {
    super(message)
    this.name = 'FormError'
    this.data = data
  }
}

export class ZodFormError extends ZodError {
  constructor(issues: ZodIssue[]) {
    super(issues)
    this.name = 'ZodFormError'
  }
}

export class ServerError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ServerError'
  }
}
