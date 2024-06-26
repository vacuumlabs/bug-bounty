'use client'

import {useSession} from 'next-auth/react'

import AuditorsNavbar from './AuditorsNavbar'
import ProjectsNavbar from './ProjectsNavbar'

import {UserRole} from '@/server/db/models'

const RoleBasedNavbar = () => {
  const session = useSession()

  if (!session.data?.user.role || session.data.user.role === UserRole.JUDGE) {
    return null
  }

  return session.data.user.role === UserRole.AUDITOR ? (
    <AuditorsNavbar />
  ) : (
    <ProjectsNavbar />
  )
}

export default RoleBasedNavbar
