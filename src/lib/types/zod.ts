import {ZodType, ZodTypeDef} from 'zod'

/**
 * Helper type to check if a zod schema satisfies a type
 */
export type ZodOutput<T> = ZodType<T, ZodTypeDef, unknown>
