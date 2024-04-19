'use server'

import {eq} from 'drizzle-orm'

import {db} from '../../db'
import {users} from '../../db/schema/user'
import {requireServerSession} from '../../utils/auth'

import {getApiFormError} from '@/lib/utils/common/error'

export const setUserAlias = async (alias: string | null) => {
  const session = await requireServerSession()
  const id = session.user.id

  const doesAliasExists = Boolean(
    alias &&
      (await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.alias, alias),
      })),
  )

  if (doesAliasExists) {
    return getApiFormError('Alias already exists')
  }

  return db.update(users).set({alias}).where(eq(users.id, id)).returning()
}
