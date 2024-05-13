import {expect} from 'vitest'

export const expectAnyString = expect.any(String) as string

export const expectAnyDate = expect.any(Date) as Date
