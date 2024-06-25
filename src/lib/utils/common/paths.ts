import {UserRole} from '@/server/db/models'

export const PATHS = {
  aboutUs: '/about-us',
  connectWallet: '/profile/connect-wallet',
  selectRole: '/select-role',
  home: '/',
  contest: (id: string) => `/contests/${id}`,
  myProjects: '/my-projects',
  myProjectDetails: (id: string) => `/my-projects/${id}`,
  myProjectsRewards: '/my-projects/rewards',
  myFindings: '/my-findings',
  myFindingsRewards: '/my-findings/rewards',
  finding: (id?: string) => (id ? `/finding/${id}` : '/finding'),
  newFinding: '/finding/new',
  newFindingSuccess: '/finding/new/success',
  newProject: '/my-projects/new',
  newProjectSuccess: '/my-projects/new/success',
  profile: '/profile',
  signIn: '/auth/signin',
  signOut: '/api/auth/signout',
} as const

export const getDashboardPathByUserRole = (
  role: UserRole | null | undefined,
): string => {
  switch (role) {
    case UserRole.AUDITOR:
      return PATHS.myFindings
    case UserRole.PROJECT_OWNER:
      return PATHS.myProjects
    default:
      return PATHS.selectRole
  }
}

export const DISCORD_URL = 'https://discord.gg/EkwDJ3X5Hd'
