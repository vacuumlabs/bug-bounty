'use server'

import bcrypt from 'bcryptjs'
import {z} from 'zod'

import {db} from '../../db'
import {users} from '../../db/schema/user'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {signUpSchema} from '@/server/utils/validations/schemas'
import {FormError} from '@/lib/types/error'

export type SignUpRequest = z.infer<typeof signUpSchema>

export const signUpWithCredentialsAction = async (request: SignUpRequest) => {
  const {email, password, name} = signUpSchema.parse(request)

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.email, email),
  })

  if (user) {
    throw new FormError('User already exists')
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

export const signUpWithCredentials = serializeServerErrors(
  signUpWithCredentialsAction,
)
