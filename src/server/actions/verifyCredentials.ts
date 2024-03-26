'use server'

import bcrypt from 'bcryptjs'

import {db} from '../db'

import type {Credentials} from '@/lib/types/auth'

export const verifyCredentials = async (
  credentials: Credentials | undefined,
) => {
  if (!credentials) {
    throw new Error('Missing credentials')
  }

  const {email, password} = credentials

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.email, email),
  })

  if (!user?.password) {
    return null
  }

  const {password: storedPassword, ...rest} = user
  const isValidPassword = await bcrypt.compare(password, storedPassword)

  return isValidPassword ? rest : null
}
