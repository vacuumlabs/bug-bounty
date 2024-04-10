import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'

import {authOptions} from '../authOptions'

export const getServerAuthSession = () => getServerSession(authOptions)

export const getUserId = async () => {
  const session = await getServerAuthSession()
  return session?.user.id
}

export const requireServerSession = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('Not authenticated')
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
