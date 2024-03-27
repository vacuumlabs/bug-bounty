'use server'

import {type DataSignature, checkSignature} from '@meshsdk/core'
import {getCsrfToken} from 'next-auth/react'
import {eq} from 'drizzle-orm'
import {cookies} from 'next/headers'

import {db} from '../db'
import {getServerAuthSession} from '../auth'
import {users} from '../db/schema/user'

import {formatWalletSignMessage} from '@/lib/utils/auth'

export const verifyAndAddWalletAddress = async (
  signature: DataSignature,
  walletAddress: string,
) => {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const nonce = await getCsrfToken({
    req: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  })

  if (!nonce) {
    throw new Error('Missing CSRF token.')
  }

  const isVerified = checkSignature(
    formatWalletSignMessage(walletAddress, nonce),
    walletAddress,
    signature,
  )

  if (!isVerified) {
    throw new Error('Invalid signature')
  }

  return db
    .update(users)
    .set({walletAddress, updatedAt: new Date()})
    .where(eq(users.id, session.user.id))
    .returning()
}
