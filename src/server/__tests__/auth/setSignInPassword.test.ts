import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {setSignInPasswordAction} from '@/server/actions/auth/setSignInPassword'

const userId = uuidv4()

const userToInsert: InsertUser = {
  id: userId,
  email: 'user@example.com',
  alias: 'user',
  name: 'user',
}

vi.mock('next-auth')

describe('setSignInPassword', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    await db.insert(schema.users).values(userToInsert)
  })

  it('sets sign in password successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const password = 'password'

    const result = await setSignInPasswordAction(password)

    const dbUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.id, userId),
    })

    expect(result).toEqual([dbUser])

    expect(dbUser?.password).not.toEqual(password)
    expect(dbUser?.password).not.toBeNull()
  })
})
