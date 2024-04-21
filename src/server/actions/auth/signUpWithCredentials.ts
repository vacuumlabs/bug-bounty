'use server'

import bcrypt from 'bcryptjs'
import {z} from 'zod'

import {db} from '../../db'
import {users} from '../../db/schema/user'

import {getApiFormError, getApiZodError} from '@/lib/utils/common/error'

export const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignUpParams = z.infer<typeof signUpSchema>

export const signUpWithCredentials = async (params: SignUpParams) => {
  const result = signUpSchema.safeParse(params)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {email, password, name} = result.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.email, email),
  })

  if (user) {
    // Server actions don't support throwing custom error types, so we have to use error object and handle it on client
    return getApiFormError('User already exists')
  }

  const data = await db
    .insert(users)
    .values({
      email,
      emailVerified: null,
      password: hashedPassword,
      name,
    })
    .returning()

  return data
}
