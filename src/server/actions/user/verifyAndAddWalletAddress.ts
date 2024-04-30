'use server'

import {
  type DataSignature,
  checkSignature,
  resolveRewardAddress,
} from '@meshsdk/core'
import {getCsrfToken} from 'next-auth/react'
import {eq} from 'drizzle-orm'
import {cookies} from 'next/headers'
import {z} from 'zod'

import {db} from '../../db'
import {users} from '../../db/schema/user'
import {requireServerSession} from '../../utils/auth'

import {formatWalletSignMessage} from '@/lib/utils/common/wallet'
import {getApiZodError} from '@/lib/utils/common/error'
import {ZodOutput} from '@/lib/types/zod'

const dataSignatureSchema = z.object({
  signature: z.string().min(1),
  key: z.string().min(1),
}) satisfies ZodOutput<DataSignature>

const verifyAndAddWalletAddressSchema = z.object({
  signature: dataSignatureSchema,
  walletAddress: z.string().min(1),
})

type VerifyAndAddWalletAddressRequest = z.infer<
  typeof verifyAndAddWalletAddressSchema
>

export const verifyAndAddWalletAddress = async (
  request: VerifyAndAddWalletAddressRequest,
) => {
  const session = await requireServerSession()
  const result = verifyAndAddWalletAddressSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {signature, walletAddress} = result.data

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
    resolveRewardAddress(walletAddress),
    signature,
  )

  if (!isVerified) {
    throw new Error('Invalid signature.')
  }

  return db
    .update(users)
    .set({walletAddress})
    .where(eq(users.id, session.user.id))
    .returning()
}
