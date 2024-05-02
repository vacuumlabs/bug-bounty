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
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ZodOutput} from '@/lib/types/zod'
import {ServerError} from '@/lib/types/error'

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

const verifyAndAddWalletAddressAction = async (
  request: VerifyAndAddWalletAddressRequest,
) => {
  const session = await requireServerSession()
  const {signature, walletAddress} =
    verifyAndAddWalletAddressSchema.parse(request)

  const nonce = await getCsrfToken({
    req: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  })

  if (!nonce) {
    throw new ServerError('Missing CSRF token.')
  }

  const isVerified = checkSignature(
    formatWalletSignMessage(walletAddress, nonce),
    resolveRewardAddress(walletAddress),
    signature,
  )

  if (!isVerified) {
    throw new ServerError('Invalid signature.')
  }

  return db
    .update(users)
    .set({walletAddress})
    .where(eq(users.id, session.user.id))
    .returning()
}

export const verifyAndAddWalletAddress = serializeServerErrors(
  verifyAndAddWalletAddressAction,
)
