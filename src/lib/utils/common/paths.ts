import {UserRole} from '@/server/db/models'

export const PATHS = {
  aboutUs: '/about-us',
  connectWallet: '/profile/connect-wallet',
  selectRole: '/select-role',
  home: '/',
  myProjects: '/my-projects',
  myProjectsRewards: '/my-projects/rewards',
  mySubmissions: '/my-submissions',
  mySubmissionsRewards: '/my-submissions/rewards',
  finding: (id?: string) => (id ? `/finding/${id}` : '/finding'),
  newFinding: '/finding/new',
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
      return PATHS.mySubmissions
    case UserRole.PROJECT_OWNER:
      return PATHS.myProjects
    default:
      return PATHS.selectRole
  }
}

export const DISCORD_URL = 'https://discord.gg/EkwDJ3X5Hd'
