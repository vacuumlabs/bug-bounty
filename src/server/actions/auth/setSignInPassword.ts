'use server'

import bcrypt from 'bcryptjs'
import {eq} from 'drizzle-orm'

import {db} from '../../db'
import {users} from '../../db/schema/user'
import {requireServerSession} from '../../utils/auth'

export const setSignInPassword = async (password: string) => {
  const session = await requireServerSession()

  const id = session.user.id
  const hashedPassword = await bcrypt.hash(password, 10)

  return db
    .update(users)
    .set({password: hashedPassword})
    .where(eq(users.id, id))
    .returning()
}
