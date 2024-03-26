'use server'

import {getServerAuthSession} from '../auth'
import {db} from '../db'

export const getUser = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.id, session.user.id),
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
