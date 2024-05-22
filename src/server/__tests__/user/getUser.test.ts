import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'
import {expectAnyDate} from '../utils/expect'

import {UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {getUser} from '@/server/actions/user/getUser'

const userId = uuidv4()

const userToInsert: InsertUser = {
  id: userId,
  email: 'user@example.com',
  alias: 'user',
  name: 'user',
}

vi.mock('next-auth')

describe('getUser', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    await db.insert(schema.users).values(userToInsert)
  })

  it('gets a user successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const result = await getUser()

    expect(result).toEqual({
      id: userId,
      email: 'user@example.com',
      alias: 'user',
      name: 'user',
      image: null,
      password: null,
      role: UserRole.AUDITOR,
      walletAddress: null,
      emailVerified: expectAnyDate,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
    })
  })
})
