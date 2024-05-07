import {redirect} from 'next/navigation'
import {Session, getServerSession} from 'next-auth'

import {authOptions} from '../authOptions'
import {UserRole} from '../db/models'
import {db} from '../db'

import {ServerError} from '@/lib/types/error'

export const getServerAuthSession = () => getServerSession(authOptions)

export const getUserId = async () => {
  const session = await getServerAuthSession()
  return session?.user.id
}

export const requireServerSession = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    throw new ServerError('Not authenticated.')
  }

  return session
}

export const requirePageSession = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/api/auth/error?error=AccessDenied')
  }

  return session
}

export const requireJudgeAuth = async () => {
  const session = await getServerAuthSession()

  if (!session || session.user.role !== UserRole.JUDGE) {
    throw new ServerError('Not authorized - JUDGE role is required.')
  }

  return session
}

export const isJudge = (session: Session | null) =>
  session?.user.role === UserRole.JUDGE

export const requireGitHubAuth = async () => {
  const session = await getServerAuthSession()

  if (!session || session.user.provider !== 'github') {
    throw new ServerError(
      'Not authorized - GitHub authenticated account is required.',
    )
  }

  const account = await db.query.accounts.findFirst({
    columns: {access_token: true},
    where: (account, {eq, and}) =>
      and(eq(account.userId, session.user.id), eq(account.provider, 'github')),
  })

  if (!account) {
    throw new ServerError('GitHub account not found.')
  }

  return {session, account}
}
