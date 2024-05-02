'use server'

import {db} from '../../db'
import {requireServerSession} from '../../utils/auth'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'

const getUserAction = async () => {
  const session = await requireServerSession()

  const user = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.id, session.user.id),
  })

  if (!user) {
    throw new ServerError('User not found')
  }

  return user
}

export const getUser = serializeServerErrors(getUserAction)
