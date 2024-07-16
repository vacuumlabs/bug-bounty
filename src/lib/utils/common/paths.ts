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
  myProjectDetails: (id: string) => `/my-projects/${id}`,
  myProjectVulnerability: (projectId: string, deduplicatedFindingId: string) =>
    `/my-projects/${projectId}/vulnerabilities/${deduplicatedFindingId}`,
  myProjectVulnerabilityReport: (
    projectId: string,
    deduplicatedFindingId: string,
    findingId: string,
  ) =>
    `/my-projects/${projectId}/vulnerabilities/${deduplicatedFindingId}/reports/${findingId}`,
  myProjectsRewards: '/my-projects/rewards',
  myFindings: '/my-findings',
  myFindingsRewards: '/my-findings/rewards',
  myFinding: (id: string) => `/my-findings/${id}`,
  newFinding: '/finding/new',
  newFindingSuccess: '/finding/new/success',
  newProject: '/my-projects/new',
  newProjectSuccess: '/my-projects/new/success',
  profile: '/profile',
  signIn: '/auth/signin',
  signOut: '/api/auth/signout',
  judgeContests: '/judge/contests',
} as const

export const getDashboardPathByUserRole = (
  role: UserRole | null | undefined,
): string => {
  switch (role) {
    case UserRole.AUDITOR:
      return PATHS.myFindings
    case UserRole.PROJECT_OWNER:
      return PATHS.myProjects
    case UserRole.JUDGE:
      return PATHS.judgeContests
    default:
      return PATHS.selectRole
  }
}

export const getAboutUsPath = (
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
