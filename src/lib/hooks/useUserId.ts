import {useSession} from 'next-auth/react'

export const useUserId = () => {
  const session = useSession()
  return session.data?.user.id
}
