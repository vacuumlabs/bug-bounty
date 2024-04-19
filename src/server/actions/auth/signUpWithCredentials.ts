'use server'

import bcrypt from 'bcryptjs'

import {db} from '../../db'
import {users} from '../../db/schema/user'

import {Credentials} from '@/lib/types/auth'

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
    return {
      type: 'error',
      message: 'User already exists',
    } as const
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

  return {
    type: 'success',
    data,
  } as const
}
