import {HomePageTab} from '@/lib/types/enums'
import {UserRole} from '@/server/db/models'

export const PATHS = {
  aboutUs: (role: UserRole) => {
    switch (role) {
      case UserRole.AUDITOR:
        return '/about-us?tab=for-hunters'
      case UserRole.PROJECT_OWNER:
        return '/about-us?tab=for-projects'
      default:
        return '/about-us'
    }
  },
  connectWallet: '/profile/connect-wallet',
  selectRole: '/select-role',
  home: '/',
  contest: (id: string) => `/contests/${id}`,
  myProjects: '/my-projects',
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

export const getAboutUsPathByUserRoleAndHomePageTab = (
  role: UserRole | null | undefined,
  tab: string | undefined,
) => {
  if (role) {
    return PATHS.aboutUs(role)
  }

  if (tab === HomePageTab.PROJECTS) {
    return PATHS.aboutUs(UserRole.PROJECT_OWNER)
  }

  return PATHS.aboutUs(UserRole.AUDITOR)
}

export const DISCORD_URL = 'https://discord.gg/EkwDJ3X5Hd'
