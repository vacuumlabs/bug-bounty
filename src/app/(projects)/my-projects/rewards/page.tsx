import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetMyContests} from '@/lib/queries/contest/getMyContests'
import ProjectsRewardsOverview from '@/components/sections/projects/ProjectsRewardsOverview'
import Separator from '@/components/ui/Separator'
import MyContestsRewards from '@/components/sections/projects/MyContestsRewards'

const MyProjectsRewardsPage = async () => {
  await requirePageSession()
  await prefetchGetMyContests({})

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
      <h1 className="mx-24 mb-6 text-headlineS uppercase">Rewards overview</h1>
      <HydrationBoundary>
        <ProjectsRewardsOverview className="mx-24 mb-12" />
        <Separator />
        <MyContestsRewards />
      </HydrationBoundary>
    </main>
  )
}

export default MyProjectsRewardsPage
