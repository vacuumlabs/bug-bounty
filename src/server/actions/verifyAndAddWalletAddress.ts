'use server'

import {type DataSignature, checkSignature} from '@meshsdk/core'
import {getCsrfToken} from 'next-auth/react'
import {eq} from 'drizzle-orm'
import {cookies} from 'next/headers'

import {db} from '../db'
import {users} from '../db/schema/user'
import {requireServerSession} from '../utils/auth'

import {formatWalletSignMessage} from '@/lib/utils/common/wallet'

export const verifyAndAddWalletAddress = async (
  signature: DataSignature,
  walletAddress: string,
) => {
  const session = await requireServerSession()

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
    .set({walletAddress})
    .where(eq(users.id, session.user.id))
    .returning()
}
