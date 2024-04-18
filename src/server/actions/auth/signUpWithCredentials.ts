'use server'

import bcrypt from 'bcryptjs'

import {db} from '../../db'
import {users} from '../../db/schema/user'

import {Credentials} from '@/lib/types/auth'
import {getApiFormError} from '@/lib/utils/common/error'

export type SignUpProps = Credentials & {
  name: string
}

export const signUpWithCredentials = async ({
  email,
  password,
  name,
}: SignUpProps) => {
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
