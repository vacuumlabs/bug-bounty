import Image from 'next/image'
import {redirect} from 'next/navigation'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import ProjectsDashboardOverview from '@/components/sections/projects/ProjectsDashboardOverview'
import backgroundImage from '@public/images/thin-overlay.png'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetMyContests} from '@/lib/queries/contest/getMyContests'
import {prefetchGetMyContestsReportCounts} from '@/lib/queries/contest/getMyContestsReportCounts'
import MyContests from '@/components/sections/projects/MyContests'
import {PATHS} from '@/lib/utils/common/paths'

const MyProjectsPage = async () => {
  const session = await requirePageSession()

  if (!session.user.role) {
    redirect(PATHS.selectRole)
  }

  await Promise.all([
    prefetchGetMyContestsReportCounts(),
    prefetchGetMyContests({}),
  ])

  return (
    <main className="mt-12 flex flex-grow flex-col">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <h1 className="mx-24 mb-6 text-headlineS uppercase">Projects overview</h1>
      <HydrationBoundary>
        <ProjectsDashboardOverview className="mx-24 mb-12" />
        <MyContests />
      </HydrationBoundary>
    </main>
  )
}

export default MyProjectsPage
