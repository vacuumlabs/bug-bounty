'use server'

import {db} from '../../db'
import {requireServerSession} from '../../utils/auth'

export const getUser = async () => {
  const session = await requireServerSession()

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.id, session.user.id),
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
