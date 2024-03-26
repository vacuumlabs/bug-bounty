'use server'

import bcrypt from 'bcryptjs'
import {eq} from 'drizzle-orm'

import {db} from '../db'
import {users} from '../db/schema/user'
import {getServerAuthSession} from '../auth'

export const setSignInPassword = async (password: string) => {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const id = session.user.id
  const hashedPassword = await bcrypt.hash(password, 10)

  return db
    .update(users)
    .set({password: hashedPassword})
    .where(eq(users.id, id))
    .returning()
}
