import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {setUserAliasAction} from '@/server/actions/user/setUserAlias'

const userId = uuidv4()

const userToInsert: InsertUser = {
  id: userId,
  email: 'user@example.com',
}

vi.mock('next-auth')

describe('setUserAlias', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    await db.insert(schema.users).values(userToInsert)
  })

  it('sets a user alias successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const result = await setUserAliasAction('alias')

    const dbUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.id, userId),
    })

    expect(result).toEqual([{...dbUser, alias: 'alias'}])
  })

  it('fails if alias is already taken', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    // insert different user with the same alias
    await db
      .insert(schema.users)
      .values({email: 'user2@example.com', alias: 'alias'})

    await expect(async () => {
      await setUserAliasAction('alias')
    }).rejects.toThrowError('Alias already exists.')
  })
})
