import {describe, it, expect, vi, beforeEach} from 'vitest'

import {trunacateDb} from '../utils/db'

import {db, schema} from '@/server/db'
import {
  SignUpRequest,
  signUpWithCredentialsAction,
} from '@/server/actions/auth/signUpWithCredentials'
import {InsertUser} from '@/server/db/schema/user'

const signUpRequest: SignUpRequest = {
  email: 'user@example.com',
  name: 'user',
  password: 'password',
}

describe('signUpWithCredentials', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()
  })

  it('signs up with credentials successfully', async () => {
    const result = await signUpWithCredentialsAction(signUpRequest)

    const dbUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.email, signUpRequest.email),
    })

    expect(result).toEqual([dbUser])
    expect(dbUser?.password).not.toEqual(signUpRequest.password)
    expect(dbUser?.password).not.toBeNull()
  })

  it('throws error if user already exists', async () => {
    const userToInsert: InsertUser = {
      email: signUpRequest.email,
      name: signUpRequest.name,
    }

    await db.insert(schema.users).values(userToInsert)

    await expect(signUpWithCredentialsAction(signUpRequest)).rejects.toThrow(
      'User already exists',
    )
  })
})
