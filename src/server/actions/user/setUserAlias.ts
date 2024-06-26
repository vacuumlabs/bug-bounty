'use server'

import {eq} from 'drizzle-orm'

import {db} from '../../db'
import {users} from '../../db/schema/user'
import {requireServerSession} from '../../utils/auth'

import {FormError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'

export const setUserAliasAction = async (alias: string | null) => {
  const session = await requireServerSession()
  const id = session.user.id

  const doesAliasExists = Boolean(
    alias &&
      (await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.alias, alias),
      })),
  )

  if (doesAliasExists) {
    throw new FormError('Alias already exists.')
  }

  return db.update(users).set({alias}).where(eq(users.id, id)).returning()
}

export const setUserAlias = serializeServerErrors(setUserAliasAction)
