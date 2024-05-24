import {describe, it, expect, vi, beforeEach} from 'vitest'
import bcrypt from 'bcryptjs'

import {trunacateDb} from '../utils/db'

import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {
  Credentials,
  verifyCredentials,
} from '@/server/actions/auth/verifyCredentials'

const userEmail = 'user@example.co'
const userName = 'user'
const userPassword = 'password'

describe('verifyCredentials', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const userToInsert: InsertUser = {
      email: userEmail,
      name: userName,
      password: await bcrypt.hash(userPassword, 10),
    }

    await db.insert(schema.users).values(userToInsert)
  })

  it('verifies credentials for correct password', async () => {
    const request: Credentials = {
      email: userEmail,
      password: userPassword,
    }

    const result = await verifyCredentials(request)

    const dbUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.email, userEmail),
    })

    if (!dbUser) {
      throw new Error('User not found')
    }

    const {password: dbPassword, ...rest} = dbUser

    expect(result).not.toBeNull()
    expect(result).toEqual(rest)
    expect(dbPassword).not.toEqual(userPassword)
    expect(dbPassword).not.toBeNull()
  })

  it('verifies credentials for wrong password', async () => {
    const request: Credentials = {
      email: userEmail,
      password: '12345',
    }

    const result = await verifyCredentials(request)

    expect(result).toBeNull()
  })

  it('verifies credentials for no user', async () => {
    const request: Credentials = {
      email: 'user2@example.com',
      password: userPassword,
    }

    const result = await verifyCredentials(request)

    expect(result).toBeNull()
  })

  it('verifies credentials for no user password', async () => {
    const userToInsert: InsertUser = {
      email: 'user2@example.com',
      name: 'user2',
    }

    await db.insert(schema.users).values(userToInsert)

    const request: Credentials = {
      email: 'user2@example.com',
      password: '',
    }

    const result = await verifyCredentials(request)

    expect(result).toBeNull()
  })

  it('throws for no credentials', async () => {
    await expect(verifyCredentials(undefined)).rejects.toThrow(
      'Missing credentials',
    )
  })
})
