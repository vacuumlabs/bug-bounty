import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetMyFindings} from '@/lib/queries/finding/getMyFinding'
import {prefetchGetMyFindingsCounts} from '@/lib/queries/finding/getMyFindingsCounts'
import FindingsDashboardOverview from '@/components/sections/finding/FindingsDashboardOverview'
import MyFindings from '@/components/sections/finding/MyFindings'

const MySubmissionsPage = async () => {
  await requirePageSession()

  await Promise.all([prefetchGetMyFindingsCounts(), prefetchGetMyFindings({})])

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
      <h1 className="mx-24 mb-6 text-headlineS uppercase">My Submissions</h1>
      <HydrationBoundary>
        <FindingsDashboardOverview className="mx-24 mb-12" />
        <MyFindings />
      </HydrationBoundary>
    </main>
  )
}

export default MySubmissionsPage
