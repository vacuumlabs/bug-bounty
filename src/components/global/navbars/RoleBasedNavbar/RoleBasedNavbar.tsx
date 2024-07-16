'use client'

import {useSession} from 'next-auth/react'

import AuditorsNavbar from './AuditorsNavbar'
import ProjectsNavbar from './ProjectsNavbar'
import JudgesNavbar from './JudgesNavbar'

import {UserRole} from '@/server/db/models'

const RoleBasedNavbar = () => {
  const session = useSession()

  switch (session.data?.user.role) {
    case UserRole.AUDITOR:
      return <AuditorsNavbar />
    case UserRole.PROJECT_OWNER:
      return <ProjectsNavbar />
    case UserRole.JUDGE:
      return <JudgesNavbar />
    default:
      return null
  }
}

export default RoleBasedNavbar
